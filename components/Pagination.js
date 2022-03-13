import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';
import TimeSince from './TimeSince';

import { useAuth } from '../contexts/auth.js';

const Pagination = ({ loadPage, queryParam, total, items, page, limit, maxPages }) => {
  const totalPages = Math.ceil(total / limit);
  const pageOffset = totalPages > maxPages ?
    Math.max(Math.floor(page - (maxPages / 2)),0):
    0;

  if (totalPages === 1) {
    return null;
  }

  return (
    <div className="pagination flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-between">
        { page > 1 &&
          <Link href={{ query: { [queryParam]: page - 1 } }}>
            <a
              className="p-1"
              onClick={ (e) => {
                e.preventDefault();
                e.stopPropagation();
                loadPage(page - 1);
              } }
            >
              prev
            </a>
          </Link>
        }
      </div>
      <div className="flex flex-row items-center justify-between">
        { total > 0 && limit &&
          Array.from('.'.repeat(Math.min(totalPages, maxPages)).split('')).map((v, i) => {
            const toPage = i + pageOffset + 1;
            if (toPage > totalPages) {
              return;
            }
            return (
              <Link href={{ query: { [queryParam]: toPage  } }} key={ `page-${toPage}` }>
                <a
                  className={`p-1 mr-2 ${page === toPage?'bg-primary text-white':'bg-gray-100'}`}
                  onClick={ (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadPage(toPage);
                  } }
                >
                  { `${toPage}` }
                </a>
              </Link>
            )
          })
        }
      </div>
      <div className="flex flex-row items-center justify-between">
        { page < totalPages &&
          <Link href={{ query: { [queryParam]: page + 1 } }}>
            <a
              className="p-1"
              onClick={ (e) => {
                e.preventDefault();
                e.stopPropagation();
                loadPage(page + 1);
              } }
            >
              next
            </a>
          </Link>
        }
      </div>
    </div>
  );
};

Pagination.defaultProps = {
  queryParam: 'page',
  page: 1,
  limit: 50,
  maxPages: 5
};

export default Pagination;
