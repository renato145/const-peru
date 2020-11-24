import pdfplumber, json
from fastcore.all import *
from configparser import ConfigParser

END_TITLES = ['DISPOSICIONES FINALES Y TRANSITORIAS', 'DISPOSICIONES TRANSITORIAS ESPECIALES', 'DECLARACION']

def download_pdf(url, dest):
    if not Path(dest).exists(): urlsave(url, dest)
    return dest

def get_pdf_text(path):
    with pdfplumber.open(path) as pdf: res = L(pdf.pages).map(lambda x: x.extract_text())
    return res

pat_spaces = re.compile(r'[ ]+')
def clean_spaces(s): return pat_spaces.sub(' ', s.strip())

def remove_header(s): return remove_prefix(s, 'La Constitución \n')

pat_pagenum = re.compile(r'\n\s+\d+\s*$')
def remove_pagenum(s): return pat_pagenum.sub('', s)

def process_page(s):
    pipe = [remove_header, remove_pagenum]
    for f in pipe: s = f(s)
    return s

pat_footnote_n = re.compile(r'(\d+)\s.*')
def split_footnote(s):
    mat = pat_footnote_n.match(s)
    return (int(mat.group(1)),s[mat.end(1):].strip())

pat_footnote = re.compile(r'\n\d+\s(?:.|\s)*')
def extract_footnotes(s):
    footnote = pat_footnote.search(s)
    footnotes = []
    
    if footnote is not None:
        footnotes.append(footnote.group().strip())
        mat = pat_footnote_n.match(footnotes[0])
        n = int(mat.group(1))
        
        while True:
            pat = f'\n({int(mat.group(1))+1}) '
            mat = re.search(pat, footnotes[-1])
            if mat is None: break
            i = mat.start(1)
            footnotes.append(footnotes[-1][i:])
            footnotes[-2] = footnotes[-2][:i]
            
        footnotes = L(footnotes).map(lambda x: x.strip().replace('\n', '')).map(split_footnote)
        
    new_s = pat_footnote.sub('',s)
    footnotes = dict(footnotes)
    
    for idx in footnotes.keys():
        pat = f'(?<!Artículo\s)[^\d\n]({idx})[^\d]'
        mat = re.search(pat, new_s)
        assert len(mat.groups()) == 1
        i,j = mat.start(1),mat.end(1)
        new_s = f'{new_s[:i]}[^{idx}]{new_s[j:]}'
    
    return new_s,footnotes

def roman_to_int(s):
    s = s.upper()
    rom_val = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    int_val = 0
    for i in range(len(s)):
        if i > 0 and rom_val[s[i]] > rom_val[s[i - 1]]: int_val += rom_val[s[i]] - 2 * rom_val[s[i - 1]]
        else                                          : int_val += rom_val[s[i]]
    return int_val

pat_title = re.compile(r'(TITULO)\s(\w+)\b')
pat_ref = re.compile(r'\[\^(\d+)\]')
pat_title_cont = re.compile(r'(TITULO)\s(\w+)[\s\n]+([^\n]+)')

def get_titles(text):
    titles = {}
    mat = pat_title_cont.search(text)

    while True:
        n = roman_to_int(mat.group(2))
        titles[n] = {'name': mat.group(3).strip()}
        text = text[mat.end():]
        mat = pat_title_cont.search(text)
        titles[n]['text'] = text if mat is None else text[:mat.start()]
        if mat is None: break
            
    return titles

pat_chapter_cont = re.compile(r'(CAPITULO)\s(\w+)[\s\n]+([^\n]+)')
def get_chapters(text):
    chapters = {}
    mat = pat_chapter_cont.search(text)
    if mat is None:
        chapters['text'] = text
        return chapters

    while True:
        n = roman_to_int(mat.group(2))
        chapters[n] = {'name': mat.group(3).strip()}
        text = text[mat.end():]
        mat = pat_chapter_cont.search(text)
        chapters[n]['text'] = text if mat is None else text[:mat.start()]
        if mat is None: break
            
    return chapters

def get_all_chapters(data): return [{'title': k, 'chapters': get_chapters(v['text'])} for k,v in data.items()]

def get_end_sections(text, titles):
    idxs = L(titles).map(lambda x: re.search(x, text)).map(lambda x: (x.start(),x.end()))
    new_text = text[:idxs[0][0]]
    idxs = list(chunked(idxs.concat()[1:] + [None], 2))
    sections = [{'title': t, 'text': text[i:j].strip()} for t,(i,j) in zip(titles,idxs)]
    return new_text,sections

pat_art_cont = re.compile(r'(Artículo)\s+(\d+)\.-[\s\n]*([^\n]+)')
def get_articles(text):
    articles = {}
    mat = pat_art_cont.search(text)

    while True:
        n = int(mat.group(2))
        articles[n] = {'name': mat.group(3).strip()}
        text = text[mat.end():]
        mat = pat_art_cont.search(text)
        articles[n]['text'] = clean_spaces(text if mat is None else text[:mat.start()])
        if mat is None: break
            
    return articles

def get_all_articles(data):
    res = []
    for titles in data:
        title = titles['title']
        for chapter_n,chapter in titles['chapters'].items():
            articles = get_articles(chapter) if chapter_n == 'text' else get_articles(chapter['text'])
            if chapter_n == 'text': chapter_n = None
            for n,article in articles.items():
                # manual fix (remove article titles)
                if (title == 4) and (chapter_n == 14):
                    article['text'] = article['name'] + ' ' + article['text']
                    article['name'] = None

                d = {'title': title, 'chapter': chapter_n , 'article': n, **article}
                res.append(d)
            
    errors = set(range(1,len(res)+1)) - set(L(res).attrgot('article'))
    if len(errors) > 0: Exception(f'Following articles not found: {errors}')
    return res

def add_references(data, footnotes, typ, text_field='text'):
    for d in data:
        text = d[text_field]
        if text is None: refs = []
        else:
            refs = pat_ref.findall(d[text_field])
            refs = [{'ref':int(ref), 'typ': typ, 'text':footnotes[int(ref)]} for ref in refs]

        d['footnotes'] = d.get('footnotes', []) + refs

def get_chapter_names(x):
    if 'text' in x['chapters']: return []
    return [{'i':k, 'name':v['name']} for k,v in x['chapters'].items()]

def read_pdf_with_footnotes(path):
    pdf_text = get_pdf_text(path)
    pages = pdf_text.map(process_page)
    text,footnotes = zip(*pages.map(extract_footnotes))
    text = ''.join(text)
    footnotes = merge(*footnotes)

    # Manual fixes
    text = re.sub(r'CAPÍTULO XIV \[\^39\] \n \nDE LA DESCENTRALIZACIÓN', 'CAPITULO XIV DE LA DESCENTRALIZACIÓN[^39] \n', text)

    return text,footnotes

def get_intro(source_text, pdf_footnotes):
    intro = {}
    pat = re.compile(r'\w+\b')
    mat = pat.match(source_text)
    intro['title'] = mat.group()
    source_text = source_text[mat.end():]
    mat = pat_title.search(source_text)
    intro['text'] = source_text[:mat.start()].strip()
    n = int(pat_ref.search(intro['text']).group(1))
    intro['footnotes'] = [{'ref': n, 'text': pdf_footnotes[n], 'typ': 'intro'}]
    text = source_text[mat.start():]
    return text,intro

if __name__ == "__main__":
    config = ConfigParser()
    config.read('settings.ini')
    cfg = config['DEFAULT']
    path = download_pdf(cfg['url'], cfg['dest'])

    source_text,pdf_footnotes = read_pdf_with_footnotes(path)
    pdf_text,intro = get_intro(source_text, pdf_footnotes)

    titles = get_titles(pdf_text)
    chapters = get_all_chapters(titles)

    new_end,end_sections = get_end_sections(chapters[-1]['chapters']['text'], END_TITLES)
    chapters[-1]['chapters']['text'] = new_end

    articles = get_all_articles(chapters)
    add_references(articles, pdf_footnotes, 'article_name', 'name')
    add_references(articles, pdf_footnotes, 'article_text')
    add_references(end_sections, pdf_footnotes, 'end_section')
    names = [{'i': k, 'name': v['name'], 'chapters': get_chapter_names(chapters[k-1])} for k,v in titles.items()]
    for title in names: add_references(title['chapters'], pdf_footnotes, 'chapter', 'name')

    objs = [names, intro, articles, end_sections]
    names = ['names', 'intro', 'articles', 'end_sections']
    out_path = Path(cfg['out_path'])
    out_path.mkdir(exist_ok=True)

    for o,n in zip(objs,names):
        with open(out_path / (n+'.json'), 'w') as f: json.dump(o, f)
