import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import api, { formatSearch } from '../utils/api';
import TimeSince from './TimeSince';

import { useAuth } from '../contexts/auth.js';

const Pagination = ({ loadPage, queryParam, total, items, page, limit }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="card-footer pagination flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-between">
        { page > 1 &&
          <Link href={{query: { [queryParam]: page - 1 }}}>
            <a
              className="p-1"
              onClick={ (e) => {
                e.preventDefault();
                e.stopPropagation();
                loadPage(page - 1);
              } }
            >
              previous
            </a>
          </Link>
        }
      </div>
      <div className="flex flex-row items-center justify-between">
        { total && limit &&
          Array.from('.'.repeat(totalPages).split('')).map((v, i) => (
            <Link href={{query: { [queryParam]: i + 1 }}} key={ `page-${i + 1}` }>
              <a
                className={`p-1 mr-2 ${page === i + 1?'bg-primary text-primary-hover':'bg-gray-100'}`}
                onClick={ (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  loadPage(i + 1);
                } }
              >
                { `${i + 1}` }
              </a>
            </Link>
          ))
        }
      </div>
      <div className="flex flex-row items-center justify-between">
        { page < totalPages &&
          <Link href={{query: { [queryParam]: page + 1 }}}>
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
  queryParam: 'page'
};

export default Pagination;
