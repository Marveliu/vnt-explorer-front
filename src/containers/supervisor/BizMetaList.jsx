import React, { Fragment } from 'react'
import { Spin } from 'antd'

import PrimaryTitle from 'components/PrimaryTitle'
import SubTitle from 'components/SubTitle'
import BizMetaListTable from 'components/BaseTable'
import LocalText from 'i18n/LocalText'
import withLang from 'i18n/withLang'
import { calcAge } from 'utils/time'

import styles from 'containers/Common.scss'

import { Link } from 'react-router-dom'
import apis from 'utils/apis'


/*
** props.context: null --> {} --> multiple { isLoading } -->
** { error, data, isLoading: boolean, count: int }
*/
export default withLang(function BizMetaList(props) {

  const { context, currentIndex, flipPage, language } = props

  const finishFetching = context && context.hasOwnProperty('data')

  return (
    <div className={styles.container}>
      <PrimaryTitle id="bmtTitle" />

      <Spin spinning={context && context.isLoading}>
        {/* set min-height for the div */}
        <div className={styles.tableWithCount}>
          {finishFetching && (
            <Fragment>
              {/* 请求越界的分页时，data 为 []，count 仍返回总区块数，区块数组件和表单分页栏需要作判断 */}
              <SubTitle
                id="bmtSubTitle"
                arg={
                  finishFetching
                    ? context.data.length === 0
                      ? 0
                      : context.count
                    : '-/-'
                }
              />

              <BizMetaListTable
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
      no: item.No,
      bizName: item.BizName,
      bizType: item.BizType,
      desc: item.Desc,
      datas: item.Datas,
      tasks: item.Tasks,
      age: calcAge(item.Timestamp, lang),
    })
  })
  return result
}

// block list table data
const columns = [
  {
    title: <LocalText id="bmtColumn1" />,
    dataIndex: 'no',
    key: 'no',
    // eslint-disable-next-line react/display-name
    render: no => (
      <Link to={`${apis.bizMeta}/${no}`}>{no}</Link>
    )
  },
  {
    title: <LocalText id="bmtColumn2" />,
    dataIndex: 'bizName',
    key: 'bizName',
  },
  {
    title: <LocalText id="bmtColumn3" />,
    dataIndex: 'bizType',
    key: 'bizType',
  },
  {
    title: <LocalText id="bmtColumn4" />,
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: <LocalText id="bmtColumn5" />,
    dataIndex: 'datas',
    key: 'datas',
  },
  {
    title: <LocalText id="bmtColumn6" />,
    dataIndex: 'tasks',
    key: 'tasks',
  },
  {
    title: <LocalText id="bmtColumn7" />,
    dataIndex: 'age',
    key: 'age',
  },
]
