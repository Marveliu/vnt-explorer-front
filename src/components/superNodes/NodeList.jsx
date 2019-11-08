import React, { Fragment } from 'react'
import { Spin } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import NodeListTable from 'components/BaseTable'
import LocalText from 'i18n/LocalText'
import withLang from 'i18n/withLang'
import { pageSize } from 'constants/config'
import r from 'constants/routes'

import styles from 'containers/Common.scss'

const isMainnet = process.env.REACT_APP_NET === 'mainnet'
const superNodecolor = isMainnet ? '#3389ff' : '#4cc159'

/*
** props.context: null --> {} --> multiple { isLoading } -->
** { error, data, isLoading: boolean, count: int }
*/
export default withLang(
  connect()(function ListNew(props) {
    const { context: { nodes, nodesCount }, currentIndex, dispatch } = props
    const finishFetching = nodes && nodes.hasOwnProperty('data')

    const handleFlipPage = p => {
      dispatch(push(`${r.nodeList}/${p}`))

      // dispatch({
      //   type: 'dataRelayNew/fetchData',
      //   payload: {
      //     path: `${basePath}&offset=${(p - 1) * pageSize}`,
      //     ns: 'nodes',
      //     field: 'nodes'
      //   }
      // })
    }

    const genSubTitle = nodesCount => {
      if (nodesCount) {
        const { Super, Candi, Total } = nodesCount.data
        return (
          <div className={styles.multiTitle}>
            <span className={styles.multiTitle__1}>
              <span style={{ color: superNodecolor }}>•</span>
              <LocalText id="snSubTitleComp1" />
              {Super}
            </span>

            <span className={styles.multiTitle__2}>
              <span style={{ color: '#ff9603' }}>•</span>
              <LocalText id="snSubTitleComp2" />
              {Candi}
            </span>

            <span className={styles.multiTitle__3}>
              <LocalText id="snSubTitleComp3" />
              {Total}
            </span>
          </div>
        )
      }
      return (
        <div className={styles.multiTitle}>
          <span className={styles.multiTitle__1}>
            <span style={{ color: superNodecolor }}>•</span>
            <LocalText id="snSubTitleComp1" />
            --
          </span>

          <span className={styles.multiTitle__2}>
            <span style={{ color: '#ff9603' }}>•</span>
            <LocalText id="snSubTitleComp2" />
            --
          </span>

          <span className={styles.multiTitle__3}>
            <LocalText id="snSubTitleComp3" />
            --
          </span>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <Spin spinning={nodes && nodes.isLoading}>
          {/* set min-height for the div */}
          <div
            className={styles.tableWithCount}
            style={{ backgroundColor: 'white' }}
          >
            {finishFetching && (
              <Fragment>
                {/* 请求越界的分页时，data 为 []，count 仍返回总区块数，区块数组件和表单分页栏需要作判断 */}
                {genSubTitle(nodesCount)}

                <NodeListTable
                  columns={columns}
                  data={genTableData(nodes.data, currentIndex)}
                  count={nodes.count}
                  currentIndex={currentIndex}
                  flipPage={handleFlipPage}
                  tableType="tabList"
                />
              </Fragment>
            )}
          </div>
        </Spin>
        <div />
      </div>
    )
  })
)

const genTableData = (data, current) => {
  if (!Array.isArray(data) || data.length === 0) {
    return []
  }

  const result = []
  data.forEach((item, i) => {
    result.push({
      key: item.Address + i,
      ranking: {
        ranking: i + 1 + (current - 1) * pageSize,
        isSuper: item.IsSuper
      },
      name: { name: item.Vname, address: item.Address },
      votes: item.Votes,
      percentage: item.VotesPercent + '%',
      status: item.IsAlive
    })
  })
  return result
}

const columns = [
  {
    title: <LocalText id="snColumn1" />,
    dataIndex: 'ranking',
    key: 'ranking',
    // eslint-disable-next-line react/display-name
    render: ({ ranking, isSuper }) => (
      <span style={{ color: isSuper ? superNodecolor : '#ff9603' }}>
        {ranking}
      </span>
    )
  },
  {
    title: <LocalText id="snColumn2" />,
    dataIndex: 'name',
    key: 'name',
    // eslint-disable-next-line react/display-name
    render: ({ name, address }) => (
      <Link to={`/account/${address}`}>{name}</Link>
    )
  },
  {
    title: <LocalText id="snColumn3" />,
    dataIndex: 'votes',
    key: 'votes'
  },
  {
    title: <LocalText id="snColumn4" />,
    dataIndex: 'percentage',
    key: 'percentage'
  },
  {
    title: <LocalText id="snColumn5" />,
    key: 'status',
    dataIndex: 'status',
    // eslint-disable-next-line react/display-name
    render: status => (
      <span style={{ color: status ? '#4cc159' : 'red' }}>
        {status ? 'Active' : 'Inactive'}
      </span>
    )
  }
]
