import React, { Fragment } from 'react'
import { Spin } from 'antd'

import PrimaryTitle from 'components/PrimaryTitle'
import SubTitle from 'components/SubTitle'
import DetectListTable from 'components/BaseTable'
import LocalText from 'i18n/LocalText'
import withLang from 'i18n/withLang'
import { Link } from 'react-router-dom'
import { calcAge } from 'utils/time'


import styles from 'containers/Common.scss'
import apis from 'utils/apis'
import { formatAddr } from 'utils/common'

/*
** props.context: null --> {} --> multiple { isLoading } -->
** { error, data, isLoading: boolean, count: int }
*/
export default withLang(function ReportList(props) {

  const { context, currentIndex, flipPage, language } = props

  const finishFetching = context && context.hasOwnProperty('data')

  return (
    <div className={styles.container}>
      <PrimaryTitle id="dtTitle" />

      <Spin spinning={context && context.isLoading}>
        {/* set min-height for the div */}
        <div className={styles.tableWithCount}>
          {finishFetching && (
            <Fragment>
              {/* 请求越界的分页时，data 为 []，count 仍返回总区块数，区块数组件和表单分页栏需要作判断 */}
              <SubTitle
                id="dtSubTitle"
                arg={
                  finishFetching
                    ? context.data.length === 0
                      ? 0
                      : context.count
                    : '-/-'
                }
              />

              <DetectListTable
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
      id: item.Id,
      addr: item.Addr.toLowerCase(),
      score: item.Score,
      age: calcAge(item.TimeStamp, lang),
      detail: item.Detail,
      type: item.Type,
    })
  })
  return result
}

// block list table data
const columns = [
  {
    title: <LocalText id="dtColumn1" />,
    dataIndex: 'id',
    key: 'id',
    // eslint-disable-next-line react/display-name
    render: id => (
      <Link to={`${apis.report}/${id}`}>{id}</Link>
    )
  },

  {
    title: <LocalText id="dtColumn2" />,
    dataIndex: 'addr',
    key: 'addr',
    // eslint-disable-next-line react/display-name
    render: addr => {
      return (
        <Link to={`/account/${addr}`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {formatAddr(addr, 12, 8)}
          </div>
        </Link>
      )
    }
  },
  {
    title: <LocalText id="dtColumn3" />,
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: <LocalText id="dtColumn4" />,
    dataIndex: 'detail',
    key: 'detail',
  },
  {
    title: <LocalText id="dtColumn5" />,
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: <LocalText id="dtColumn6" />,
    dataIndex: 'age',
    key: 'age',
  },
]
