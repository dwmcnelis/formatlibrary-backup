/* eslint-disable complexity */

import React from 'react'

const Pagination = props => {
  console.log('props.page', props.page)
  console.log(
    'props.page <= Math.ceil(props.cards.length / props.cardsPerPage)',
    props.page <= Math.ceil(props.cards.length / props.cardsPerPage)
  )
  console.log(
    'Math.ceil(props.cards.length / props.cardsPerPage)',
    Math.ceil(props.cards.length / props.cardsPerPage)
  )
  return (
    <div>
      {props.page !== 1 && props.cards.length ? (
        <a
          className="pageButton"
          type="submit"
          onClick={() => {
            props.previousPage(props.location)
          }}
        >
          ◀
        </a>
      ) : (
        ''
      )}

      {props.cards.length ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 3 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(props.cards.length / props.cardsPerPage) - 6,
                  props.location
                )
              }}
            >
              {' '}
              {Math.ceil(props.cards.length / props.cardsPerPage) - 6}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page - 3, props.location)
              }}
            >
              {' '}
              {props.page - 3}{' '}
            </a>
          )
        ) : props.page === 1 ? (
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
              props.goToPage(1, props.location)
            }}
          >
            {' '}
            1{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 2 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 2 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(props.cards.length / props.cardsPerPage) - 5,
                  props.location
                )
              }}
            >
              {' '}
              {Math.ceil(props.cards.length / props.cardsPerPage) - 5}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page - 2, props.location)
              }}
            >
              {' '}
              {props.page - 2}{' '}
            </a>
          )
        ) : props.page === 2 ? (
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
              props.goToPage(2, props.location)
            }}
          >
            {' '}
            2{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 3 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 2 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(props.cards.length / props.cardsPerPage) - 4,
                  props.location
                )
              }}
            >
              {' '}
              {Math.ceil(props.cards.length / props.cardsPerPage) - 4}{' '}
            </a>
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page - 1, props.location)
              }}
            >
              {' '}
              {props.page - 1}{' '}
            </a>
          )
        ) : props.page === 3 ? (
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
              props.goToPage(3, props.location)
            }}
          >
            {' '}
            3{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 4 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 3 ? (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(
                  Math.ceil(props.cards.length / props.cardsPerPage) - 3,
                  props.location
                )
              }}
            >
              {' '}
              {Math.ceil(props.cards.length / props.cardsPerPage) - 3}{' '}
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
              {props.page}{' '}
            </a>
          )
        ) : props.page === 4 ? (
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
              props.goToPage(4, props.location)
            }}
          >
            {' '}
            4{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 5 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 3 ? (
            props.page ===
            Math.ceil(props.cards.length / props.cardsPerPage) - 2 ? (
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
                {Math.ceil(props.cards.length / props.cardsPerPage) - 2}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(props.cards.length / props.cardsPerPage) - 2,
                    props.location
                  )
                }}
              >
                {' '}
                {Math.ceil(props.cards.length / props.cardsPerPage) - 2}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page + 1, props.location)
              }}
            >
              {' '}
              {props.page + 1}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(5, props.location)
            }}
          >
            {' '}
            5{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 6 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 3 ? (
            props.page ===
            Math.ceil(props.cards.length / props.cardsPerPage) - 1 ? (
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
                {Math.ceil(props.cards.length / props.cardsPerPage) - 1}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(props.cards.length / props.cardsPerPage) - 1,
                    props.location
                  )
                }}
              >
                {' '}
                {Math.ceil(props.cards.length / props.cardsPerPage) - 1}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page + 2, props.location)
              }}
            >
              {' '}
              {props.page + 2}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(6, props.location)
            }}
          >
            {' '}
            6{' '}
          </a>
        )
      ) : (
        ''
      )}

      {Math.ceil(props.cards.length / props.cardsPerPage) >= 7 ? (
        props.page > 4 ? (
          props.page >
          Math.ceil(props.cards.length / props.cardsPerPage) - 3 ? (
            props.page ===
            Math.ceil(props.cards.length / props.cardsPerPage) ? (
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
                {Math.ceil(props.cards.length / props.cardsPerPage)}{' '}
              </a>
            ) : (
              <a
                className="pageButton"
                type="submit"
                onClick={() => {
                  props.goToPage(
                    Math.ceil(props.cards.length / props.cardsPerPage),
                    props.location
                  )
                }}
              >
                {' '}
                {Math.ceil(props.cards.length / props.cardsPerPage)}{' '}
              </a>
            )
          ) : (
            <a
              className="pageButton"
              type="submit"
              onClick={() => {
                props.goToPage(props.page + 3, props.location)
              }}
            >
              {' '}
              {props.page + 3}{' '}
            </a>
          )
        ) : (
          <a
            className="pageButton"
            type="submit"
            onClick={() => {
              props.goToPage(7, props.location)
            }}
          >
            {' '}
            7{' '}
          </a>
        )
      ) : (
        ''
      )}

      {props.page !== Math.ceil(props.cards.length / props.cardsPerPage) &&
      props.cards.length ? (
        <a
          className="pageButton"
          type="submit"
          onClick={() => {
            props.nextPage(props.location)
          }}
        >
          ▶
        </a>
      ) : (
        ''
      )}
    </div>
  )
}

export default Pagination
