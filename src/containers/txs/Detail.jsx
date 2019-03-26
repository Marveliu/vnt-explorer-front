import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import Title from 'components/AugmTitle'
import { Table, Icon } from 'antd'
import { Link } from 'react-router-dom'

import LocalText from 'i18n/LocalText'
import DataProvider from 'containers/RPDataProvider'
import apis from 'utils/apis'
import ErrorMessenger from 'components/ErrorMessenger'

import withLang from 'i18n/withLang'
import { calcAge, formatTime } from 'utils/time'
import textSplit from 'utils/longTextSplitter'

import styles from 'containers/Common.scss'

const mapStateToProps = ({ transactions: { txDetail } }) => {
  return {
    txDetail
  }
}

export default withLang(
  connect(mapStateToProps)(function TxDetail(props) {
    const urlPath = location.pathname.split('/').filter(item => item)
    const currentTx = urlPath.length > 0 ? urlPath[urlPath.length - 1] : 0

    useEffect(
      () => {
        props.dispatch({
          type: 'dataRelay/fetchData',
          payload: {
            // `path` here not robust
            path: `${apis.tx}/${
              props.location.pathname.split('/').filter(item => item)[1]
            }`,
            ns: 'transactions',
            field: 'txDetail'
          }
        })
      },
      [props.location.pathname]
    )

    return (
      <div>
        {/* tx hash length: 66 */}
        <Title
          titleID="tdpTitle"
          suffix={
            props.txDetail &&
            props.txDetail.data &&
            props.txDetail.data.hasOwnProperty('Hash')
              ? `${props.txDetail.data.Hash}`
              : ''
          }
          fieldWidth={1}
        />

        <DataProvider
          options={{
            path: `${apis.tx}/${currentTx}`,
            ns: 'transactions',
            field: 'txDetail'
          }}
          render={data => (
            <DetailTable
              context={data}
              dispatch={props.dispatch}
              errComp={<ErrorMessenger context={data} />}
              lang={props.language}
            />
          )}
        />
      </div>
    )
  })
)

function DetailTable(props) {
  const columns = [
    {
      title: <LocalText id="tdpField1" />,
      dataIndex: 'fieldName',
      key: 'fieldName'
    },
    {
      title:
        props.context && props.context.data ? props.context.data.Hash : '-/-',
      dataIndex: 'value',
      key: 'value'
    }
  ]

  const data = []
  if (props.context && props.context.data) {
    const {
      TimeStamp,
      Status,
      BlockNumber,
      From,
      To,
      IsToken,
      TokenTo,
      TokenAmount,
      GasUsed,
      GasLimit,
      GasPrice,
      Nonce,
      Input,
      Value
    } = props.context.data

    // console.log(props.context.data)

    data.push({
      key: 'status',
      fieldName: <LocalText id="tdpField2" />,
      value: Status
    })
    data.push({
      key: 'height',
      fieldName: <LocalText id="tdpField3" />,
      value: <Link to={`${apis.block}/${BlockNumber}`}>{BlockNumber}</Link>
    })
    data.push({
      key: 'timestamp',
      fieldName: <LocalText id="tdpField4" />,
      value: `${calcAge(TimeStamp, props.lang)} (${formatTime(TimeStamp)})`
    })
    data.push({
      key: 'from',
      fieldName: <LocalText id="tdpField5" />,
      value: <Link to={`/account/${From}`}>{From}</Link>
    })
    data.push({
      key: 'to',
      fieldName: <LocalText id="tdpField6" />,
      value: To ? <Link to={`/account/${To.Address}`}>{To.Address}</Link> : '-'
    })
    data.push({
      key: 'transfer',
      fieldName: <LocalText id="tdpField7" />,
      value:
        To && IsToken ? (
          <Fragment>
            <LocalText id="tdpField5" />
            <Link to={`/account/${From}`}>
              {From.slice(0, 12) + '...'}
            </Link>{' '}
            <LocalText id="tdpField6" />{' '}
            <Link to={`/account/${TokenTo}`}>
              <Icon type="project" /> {TokenTo.slice(0, 12) + '...'}
            </Link>
            <LocalText id="tdpField14" /> {TokenAmount}
          </Fragment>
        ) : (
          '-'
        )
    })
    data.push({
      key: 'value',
      fieldName: <LocalText id="tdpField8" />,
      value: Value
    })
    data.push({
      key: 'gasLimit',
      fieldName: <LocalText id="tdpField9" />,
      value: GasLimit
    })
    data.push({
      key: 'gasUsed',
      fieldName: <LocalText id="tdpField10" />,
      value: GasUsed
    })
    data.push({
      key: 'gasPrice',
      fieldName: <LocalText id="tdpField11" />,
      value: GasPrice
    })
    data.push({
      key: 'nonce',
      fieldName: <LocalText id="tdpField12" />,
      value: Nonce
    })
    data.push({
      key: 'input',
      fieldName: <LocalText id="tdpField13" />,
      value: (
        <div>
          {textSplit(Input, 24).map(item => (
            <p style={{ marginBottom: '0', lineHeight: '1' }} key={item}>
              {item}
            </p>
          ))}
        </div>
      )
    })
  }

  return (
    <div>
      {props.context &&
        props.context.error && <Fragment>{props.errComp}</Fragment>}

      {props.context &&
        !props.context.error && (
          <Table
            className={styles.revTable}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        )}
    </div>
  )
}
