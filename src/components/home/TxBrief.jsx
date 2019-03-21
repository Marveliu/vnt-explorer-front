import React, { Fragment } from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'

import LocalText from 'i18n/LocalText'

import calcAge from 'utils/age'

import styles from './BlockTx.scss'

export default function TxBrief(props) {
  const formattedData = data => {
    return data.map(item => ({
      from: item.From,
      to: {
        isContract: item.To ? item.To.isContract : false,
        name: item.To ? item.To.ContractName : '',
        value: item.To ? item.To.Address : ''
      },
      txHash: item.Hash,
      timeStamp: item.TimeStamp,
      amount: item.Value
    }))
  }
  return (
    <div className={`${styles.section} ${styles['section--2']}`}>
      <div className={styles.header}>
        <div className={styles.header__title}>
          <span>
            <LocalText id="rTitle" />
          </span>
        </div>

        {props.context &&
          props.context.data &&
          props.context.data.length && (
            <span>
              <Link to="/txs">
                <LocalText id="rField1" />
              </Link>
            </span>
          )}
      </div>

      {props.context &&
        props.context.error && <Fragment>{props.errComp}</Fragment>}

      {props.context &&
        props.context.data &&
        props.context.data.length && (
          <Fragment>
            {formattedData(props.context.data).map((item, i) => (
              <div className={styles.content} key={JSON.stringify(item) + i}>
                <div className={styles.item}>
                  <div
                    className={`${styles['item__row']} ${
                      styles['item__row--1']
                    }`}
                  >
                    <Icon type="swap" />
                    <span>{item.txHash.slice(0, 24) + '...'}</span>
                  </div>

                  <div
                    className={`${styles['item__row']} ${
                      styles['item__row--resp']
                    }`}
                  >
                    <span>
                      <LocalText id="rField2" />
                      <Link to={`/account/${item.from}`}>
                        {item.from.slice(0, 15) + '...'}
                      </Link>
                    </span>
                    <span>
                      <LocalText id="rField3" />
                      {(function() {
                        // console.log('TxBrief: item.to: ', item.to)
                        if (item.to.value != '') {
                          return (
                            <Link to={`/account/${item.to.value}`}>
                              {item.to.name ||
                                item.to.value.slice(0, 15) + '...'}
                            </Link>
                          )
                        } else {
                          return ''
                        }
                      })()}
                    </span>
                    <span>
                      <LocalText id="rField4" />
                      {item.amount}
                    </span>
                    <span>{calcAge(item.timeStamp, props.lang)}</span>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        )}
    </div>
  )
}
