import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api, { formatSearch } from '../../utils/api';
import { PLATFORM_NAME } from '../../config'

const Search = ({ tags, error, keyword, articles }) => (
  <Layout>
    <Head>
      <title>Search { PLATFORM_NAME }</title>
    </Head>
    <div className="main-content fullwidth intro">
      <div className="columns">
        <main className="col lg">
          <section className="article limit-width">
            <h1 className="long">
              Search
            </h1>
            <div className="article-previews two-col">
              { error ?
                <div className="validation-error">{ error }</div>:
                articles ?
                  articles.map(article => {
                    return (
                      <div className="article-preview" key={ article._id }>
                        <Link href={ `/${article.slug}` } href="/[slug]">
                          <a role="button">
                          <span className="title">
                            {article.title}
                          </span>
                          { article.summary &&
                            <span className="summary">{ article.summary }</span>
                          }
                          </a>
                        </Link>
                      </div>
                    );
                  }):
                  <div className="Loading">Loading...</div>
              }
            </div>
          </section>
        </main>
        <section className="col">
          <h2>Related content</h2>
          <p className="tags">
            { tags ?
              tags.map(tag => (
                  <Link as={ `/search/${encodeURIComponent(tag)}` } href="/search/[keyword]" key={ tag }><a className="tag">{tag}</a></Link>
              )):
              !error && <span className="Loading">Loading...</span>
            }
          </p>
        </section>
      </div>
    </div>
  </Layout>
);

Search.getInitialProps = async ({ req, query }) => {
  try {
    const [tags, articles] = await Promise.all([
      api.get('/distinct/article/tags'),
      api.get('/article?limit=100')
    ]);

    return {
      tags: tags.data?.results,
      articles: articles.data?.results,
    }
  } catch (error) {
    return {
      error: error.message
    };
  }
}

export default Search;
