/* eslint-disable complexity */

import React from 'react'

const Pagination = (props = {}) => {
  const { length = 0, itemsPerPage = 12, location = 'top', page = 1 } = props
  if(length <= itemsPerPage) return <div></div>

  return (
    <div>
      {page !== 1 && length ? (
        <a
          className="pageButton"
          id="to-start"
          type="submit"
          onClick={() => {
            props.goToPage(1, location)
          }}
        />
      ) : (
        ''
      )}
      {page !== 1 && length ? (
        <a
          className="pageButton"
          type="submit"
          onClick={() => {
            props.previousPage(location)
          }}
        >
          ◀
        </a>
      ) : (
        ''
      )}

      {length ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 3 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(length / itemsPerPage) - 6,
                  location
                )
              }}
            >
              {' '}
              {Math.ceil(length / itemsPerPage) - 6}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page - 3, location)
              }}
            >
              {' '}
              {page - 3}{' '}
            </a>
          )
        ) : page === 1 ? (
          <a
            className="pageButton"
            type="submit"
            style={{
              backgroundColor: '#c7ccd4',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            {' '}
            1{' '}
          </a>
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(1, location)
            }}
          >
            {' '}
            1{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 2 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 2 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(length / itemsPerPage) - 5,
                  location
                )
              }}
            >
              {' '}
              {Math.ceil(length / itemsPerPage) - 5}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page - 2, location)
              }}
            >
              {' '}
              {page - 2}{' '}
            </a>
          )
        ) : page === 2 ? (
          <a
            className="pageButton"
            type="submit"
            style={{
              backgroundColor: '#c7ccd4',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            {' '}
            2{' '}
          </a>
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(2, location)
            }}
          >
            {' '}
            2{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 3 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 2 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(length / itemsPerPage) - 4,
                  location
                )
              }}
            >
              {' '}
              {Math.ceil(length / itemsPerPage) - 4}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page - 1, location)
              }}
            >
              {' '}
              {page - 1}{' '}
            </a>
          )
        ) : page === 3 ? (
          <a
            className="pageButton"
            type="submit"
            style={{
              backgroundColor: '#c7ccd4',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            {' '}
            3{' '}
          </a>
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(3, location)
            }}
          >
            {' '}
            3{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 4 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 3 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(length / itemsPerPage) - 3,
                  location
                )
              }}
            >
              {' '}
              {Math.ceil(length / itemsPerPage) - 3}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              style={{
                backgroundColor: '#c7ccd4',
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              {' '}
              {page}{' '}
            </a>
          )
        ) : page === 4 ? (
          <a
            className="pageButton"
            type="submit"
            style={{
              backgroundColor: '#c7ccd4',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            {' '}
            4{' '}
          </a>
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(4, location)
            }}
          >
            {' '}
            4{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 5 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 3 ? (
            page ===
            Math.ceil(length / itemsPerPage) - 2 ? (
              <a
                className="pageButton"
                type="submit"
                style={{
                  backgroundColor: '#c7ccd4',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage) - 2}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(length / itemsPerPage) - 2,
                    location
                  )
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage) - 2}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page + 1, location)
              }}
            >
              {' '}
              {page + 1}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(5, location)
            }}
          >
            {' '}
            5{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 6 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 3 ? (
            page ===
            Math.ceil(length / itemsPerPage) - 1 ? (
              <a
                className="pageButton"
                type="submit"
                style={{
                  backgroundColor: '#c7ccd4',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage) - 1}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(length / itemsPerPage) - 1,
                    location
                  )
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage) - 1}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page + 2, location)
              }}
            >
              {' '}
              {page + 2}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(6, location)
            }}
          >
            {' '}
            6{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(length / itemsPerPage) >= 7 ? (
        page > 4 ? (
          page >
          Math.ceil(length / itemsPerPage) - 3 ? (
            page ===
            Math.ceil(length / itemsPerPage) ? (
              <a
                className="pageButton"
                type="submit"
                style={{
                  backgroundColor: '#c7ccd4',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage)}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(length / itemsPerPage),
                    location
                  )
                }}
              >
                {' '}
                {Math.ceil(length / itemsPerPage)}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(page + 3, location)
              }}
            >
              {' '}
              {page + 3}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(7, location)
            }}
          >
            {' '}
            7{' '}
          </a>
        )
      ) : (
        ''
      )}

      {page !== Math.ceil(length / itemsPerPage) &&
      length ? (
        <a
          className="pageButton"
          type="submit"
          onClick={() => {
            props.nextPage(location)
          }}
        >
          ▶
        </a>
      ) : (
        ''
      )}

      {page !== Math.ceil(length / itemsPerPage) &&
      length ? (
        <a
          className="pageButton"
          id="to-end"
          type="submit"
          onClick={() => {
            props.goToPage(
              Math.ceil(length / itemsPerPage),
              location
            )
          }}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default Pagination
