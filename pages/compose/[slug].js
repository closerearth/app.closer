import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import slugify from 'slugify';
import Editor, { exec } from 'react-pell';
import Layout from '../../components/Layout';
import UploadPhoto from '../../components/UploadPhoto';
import api, { cdn } from '../../utils/api';

const cleanHtml = html => String(html || '')
  // add no noreferrer
  .replace(new RegExp('(<a\s*(?!.*\brel=)[^>]*)(href="https?://)((?!oasa.co)[^"]+)"([^>]*)>','g'), '$1$2$3"$4 rel="noreferrer nofollow">')
  // add link target
  .replace(new RegExp('(<a\s*(?!.*\btarget=)[^>]*)(href="https?://)((?!oasa.co)[^"]+)"([^>]*)>','g'), '$1$2$3"$4 target="_blank">')
  // strip style attributes
  .replace(new RegExp('(<[^>]+) style=".*?"','gi'), '$1')
  // strip meta tags
  .replace(/<meta\b[^>]*\/?>/i,'')
;
const getArticleSlug = article => article.slug || slugify(article.title.toLowerCase().slice(0, 50));
const format = article => ({
  ...article,
  html: cleanHtml(article.html),
  tags: article.tags.split(/, ?/g),
  slug: getArticleSlug(article)
});
const saveArticle = async article => (article._id ?
    await api.patch(`/article/${article._id}`, format(article)) :
    await api.post('/article', format(article))
  ).data.results;
const suggestedFields = [
  'thumbnail',
  'component'
];
const ComposeArticle = () => {
  const [loadError, setErrors] = useState(false);
  const [html, setHTML] = useState('');
  const setSafeHTML = (html) => {
    const clean = cleanHtml(html);
    console.log('setSafeHTML', clean);
    setHTML(clean);
  };
  const editorRef = useRef(null);
  const [meta, setMeta] = useState({
    thumbnail: ''
  });
  const [article, updateArticle] = useState({
    _id: undefined,
    title: '',
    slug: '',
    photo: null,
    summary: '',
    category: '',
    tags: '',
  });
  const router = useRouter();

  // if (editorRef && editorRef.current && editorRef.current.container) {
  //   editorRef.current.container.addEventListener('paste', (e) => {
  //     // e.preventDefault();
  //     // e.stopPropagation();
  //     // const clipboardData = event.clipboardData || window.clipboardData;
  //     // const pastedData = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
  //     // const cleanContent = cleanHtml(pastedData);
  //     // console.log('Cleaning content and pasting...', cleanContent)
  //     try {
  //       console.log('Pasting done', html);
  //       // exec('insertHTML', pastedData);
  //     } catch (err) {
  //       console.log('Paste error:', err.message);
  //     }
  //   })
  // } else {
  //   console.log('Has NOT Editor')
  // }

  async function loadData() {
    try {
      if (router.query?.slug && router.query.slug !== 'new') {
        // Force to fetch without cache
        const res = await api.get(`/article/${router.query.slug}?time=${Date.now()}`);
        setHTML(cleanHtml(res.data.results.html));
        setMeta(res.data.results.meta);
        updateArticle({
          _id: res.data.results._id,
          title: res.data.results.title,
          slug: res.data.results.slug,
          photo: res.data.results.photo,
          summary: res.data.results.summary,
          category: res.data.results.category,
          tags: (res.data.results.tags || []).join(', ')
        });
      }
    } catch (err) {
      setErrors(err)
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout protect>
      <Head>
        <title>{ article.title || 'Compose article' }</title>
      </Head>
      <main className="main-content intro article">
        { article.photo && <div className="hero" style={{ backgroundImage: `url(${cdn}${article.photo}-max-lg.jpg)` }}>
        </div> }
        { loadError &&
          <div className="validation-error">
            { loadError.message }
          </div>
        }
        <section className="form-field">
          <h1>
            <input
              placeholder="Title"
              onChange={ e => updateArticle({ ...article, title: e.target.value })}
              value={ article.title }
            />
          </h1>
        </section>
        <section className="form-field">
          <label>Slug URL</label>
          <input
            placeholder="slug-url"
            onChange={ e => updateArticle({ ...article, slug: e.target.value })}
            value={ article.slug || getArticleSlug(article) }
          />
        </section>
        <section className="form-field">
          <label>Summary</label>
          <input
            placeholder="Summary"
            onChange={ e => updateArticle({ ...article, summary: e.target.value })}
            value={ article.summary }
          />
        </section>
        <section className="form-field">
          <label>Category</label>
          <input
            placeholder="Category"
            onChange={ e => updateArticle({ ...article, category: e.target.value })}
            value={ article.category }
          />
        </section>
        <section className="form-field">
          <label>Tags</label>
          <input
            placeholder="Tag1, Tag2"
            onChange={ e => updateArticle({ ...article, tags: e.target.value })}
            value={ article.tags }
          />
        </section>
        <section className="form-field">
          <label>Cover photo</label>
          <UploadPhoto
            onSave={id => updateArticle({ ...article, photo: id })}
            label={ article.photo ? 'Change photo': 'Add photo' }
          />
        </section>
        {/* <section className="form-field">
          <label>Thumnail</label>
          <input
            placeholder="/images/thumbnail.png"
            onChange={ e => setMeta({ ...meta, thumbnail: e.target.value })}
            value={ meta.thumbnail }
          />
        </section> */}
        {/* <section className="form-field">
          <label>Meta</label>
          <textarea
            placeholder="{thumbnail: /path.jpg}"
            onChange={ e => setMeta(e.target.value)}
            value={ meta }
          />
        </section> */}
        <section className="form-field">
          <Editor
            ref={editorRef}
            className="Editor article"
            actions={[
              'bold',
              'italic',
              'paragraph',
              'underline',
              'strikethrough',
              'heading1',
              'heading2',
              'olist',
              'ulist',
              'quote',
              'link',
              'image',
              'line',
            ]}
            actionBarClass="actionBar"
            buttonClass="actionButton"
            contentClass="htmlContent"
            onChange={ (html) => setHTML(html)  }
            defaultContent={ html }
          />
        </section>
        <button
          onClick={ e => {
            e.preventDefault();
            saveArticle({
              ...article,
              meta,
              html: cleanHtml(html)
            })
              .then(result => Router.push(`/${result.slug}`))
              .catch(err => alert(`Error: ${err.message}`));
          } }
        >
          Publish
        </button>
      </main>
    </Layout>
  );
};

export default ComposeArticle;
