import React, { Fragment } from 'react'
import { Spin } from 'antd'

import PrimaryTitle from 'components/PrimaryTitle'
import SubTitle from 'components/SubTitle'
import BizContractListTable from 'components/BaseTable'
import LocalText from 'i18n/LocalText'
import withLang from 'i18n/withLang'
import { Link } from 'react-router-dom'
import { calcAge } from 'utils/time'

import styles from 'containers/Common.scss'
import apis from 'utils/apis'
import contractIcon from 'assets/images/合约.png'
import { formatAddr } from 'utils/common'

/*
** props.context: null --> {} --> multiple { isLoading } -->
** { error, data, isLoading: boolean, count: int }
*/
export default withLang(function BizContractList(props) {

  const { context, currentIndex, flipPage, language } = props

  const finishFetching = context && context.hasOwnProperty('data')

  return (
    <div className={styles.container}>
      <PrimaryTitle id="bcTitle" />

      <Spin spinning={context && context.isLoading}>
        {/* set min-height for the div */}
        <div className={styles.tableWithCount}>
          {finishFetching && (
            <Fragment>
              {/* 请求越界的分页时，data 为 []，count 仍返回总区块数，区块数组件和表单分页栏需要作判断 */}
              <SubTitle
                id="bcSubTitle"
                arg={
                  finishFetching
                    ? context.data.length === 0
                      ? 0
                      : context.count
                    : '-/-'
                }
              />

              <BizContractListTable
                columns={columns}
                data={genTableData(context.data, language)}
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

const genTableData = (data, lang) => {
  if (!Array.isArray(data) || data.length === 0) {
    return []
  }
  const result = []
  data.forEach((item) => {
    result.push({
      addr: item.Address.toLowerCase(),
      owner: item.Owner.toLowerCase(),
      name: item.Name,
      desc: item.Desc,
      status: item.Status,
      age: calcAge(item.TimeStamp, lang),
      bizNo: item.BizNo,
    })
  })
  return result
}

// block list table data
const columns = [
  {
    title: <LocalText id="bcColumn1" />,
    dataIndex: 'addr',
    key: 'addr',
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
    title: <LocalText id="bcColumn2" />,
    dataIndex: 'owner',
    key: 'owner',
    // eslint-disable-next-line react/display-name
    render: owner => {
      return (
        <Link to={`/account/${owner}`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {formatAddr(owner, 12, 8)}
          </div>
        </Link>
      )
    }
  },
  {
    title: <LocalText id="bcColumn3" />,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: <LocalText id="bcColumn4" />,
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: <LocalText id="bcColumn5" />,
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: <LocalText id="bcColumn6" />,
    dataIndex: 'bizNo',
    key: 'bizNo',
    // eslint-disable-next-line react/display-name
    render: bizNo => (
      <Link to={`${apis.bizMeta}/${bizNo}`}>{bizNo}</Link>
    )
  },
  {
    title: <LocalText id="bcColumn7" />,
    dataIndex: 'age',
    key: 'age',
  },
]
