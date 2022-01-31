import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';
import TimeSince from './TimeSince';

import { useAuth } from '../contexts/auth.js';

const Pagination = ({ loadPage, queryParam, total, items, page, limit }) => {
  console.log('page', page)

  return (
    <div className="card-footer pagination">
      { page > 1 &&
        <Link href={{query: { [queryParam]: page - 1 }}} onClick={ (e) => {
          loadPage(page - 1);
        } }>
          previous
        </Link>
      }
      { total && limit &&
        Array.from('.'.repeat(Math.ceil(total / limit)).split('')).map((v, i) => (
          <Link href={{query: { [queryParam]: i + 1 }}} key={ `page-${i + 1}` } onClick={ (e) => {
            loadPage(i + 1);
          } }>
            <a className={`${page === i + 1?'active':'not-active'}`}>
              { `${i + 1}` }
            </a>
          </Link>
        ))
      }
      { (items && items.length > 0 && items.length === limit) &&
        <Link href={{query: { [queryParam]: page + 1 }}} onClick={ (e) => {
          loadPage(page + 1);
        } }>
          next
        </Link>
      }
    </div>
  );
};

Pagination.defaultProps = {
  queryParam: 'page'
};

export default Pagination;
