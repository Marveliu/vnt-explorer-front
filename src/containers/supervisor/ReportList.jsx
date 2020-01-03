import React, { Fragment } from 'react'
import { Spin } from 'antd'

import PrimaryTitle from 'components/PrimaryTitle'
import SubTitle from 'components/SubTitle'
import ReportListTable from 'components/BaseTable'
import LocalText from 'i18n/LocalText'
import withLang from 'i18n/withLang'
import { Link } from 'react-router-dom'
import { calcAge } from 'utils/time'

import styles from 'containers/Common.scss'
import contractIcon from 'assets/images/合约.png'
import apis from 'utils/apis'

/*
** props.context: null --> {} --> multiple { isLoading } -->
** { error, data, isLoading: boolean, count: int }
*/
export default withLang(function ReportList(props) {

  const { context, currentIndex, flipPage,language } = props

  const finishFetching = context && context.hasOwnProperty('data')

  return (
    <div className={styles.container}>
      <PrimaryTitle id="repTitle" />

      <Spin spinning={context && context.isLoading}>
        {/* set min-height for the div */}
        <div className={styles.tableWithCount}>
          {finishFetching && (
            <Fragment>
              {/* 请求越界的分页时，data 为 []，count 仍返回总区块数，区块数组件和表单分页栏需要作判断 */}
              <SubTitle
                id="repSubTitle"
                arg={
                  finishFetching
                    ? context.data.length === 0
                      ? 0
                      : context.count
                    : '-/-'
                }
              />

              <ReportListTable
                columns={columns}
                data={genTableData(context.data,language)}
                count={context.count}
                currentIndex={currentIndex}
                flipPage={flipPage}
                tableType="list"
              />
            </Fragment>
          )}
        </div>
      </Spin>
      <div />
    </div>
  )
})

const genTableData = (data,lang) => {
  if (!Array.isArray(data) || data.length === 0) {
    return []
  }

  const result = []
  data.forEach((item) => {
    result.push({
      id: item.Id,
      contractAddr: item.ContractAddr.toLowerCase(),
      blockNumber: item.BlockNumber,
      age: calcAge(item.TimeStamp, lang),
      txHash: item.TxHash,
      metaNo: item.MetaNo,
    })
  })
  return result
}

// block list table data
const columns = [
  {
    title: <LocalText id="repColumn1" />,
    dataIndex: 'id',
    key: 'id',
    // eslint-disable-next-line react/display-name
    render: id => (
      <Link to={`${apis.report}/${id}`}>{id}</Link>
    )
  },
  {
    title: <LocalText id="repColumn2" />,
    dataIndex: 'blockNumber',
    key: 'blockNumber',
    // eslint-disable-next-line react/display-name
    render: blockNumber => (
      <Link to={`${apis.block}/${blockNumber}`}>{blockNumber}</Link>
    )
  },
  {
    title: <LocalText id="repColumn3" />,
    dataIndex: 'txHash',
    key: 'txHash',
    // eslint-disable-next-line react/display-name
    render: txHash => (
      <Link to={`/transaction/${txHash}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* {tx.successStatus ? (
            <span />
          ) : (
              <img
                style={{ width: '.16rem' }}
                src={failedIcon}
                alt="failed icon"
              />
            )} */}
          &nbsp;
              {txHash.slice(0, 12) + '...'}
        </div>
      </Link>
    )
  },
  {
    title: <LocalText id="repColumn4" />,
    dataIndex: 'contractAddr',
    key: 'contractAddr',
    // eslint-disable-next-line react/display-name
    render: addr => (
      <Link to={`/contract/${addr}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className="contractIcon" src={contractIcon} /> &nbsp;
          {addr}
        </div>
      </Link>
    )
  },
  {
    title: <LocalText id="repColumn5" />,
    dataIndex: 'metaNo',
    key: 'metaNo',
  },
  {
    title: <LocalText id="repColumn6" />,
    dataIndex: 'age',
    key: 'age',
  }
]
