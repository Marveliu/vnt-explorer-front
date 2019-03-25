import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import { Link } from 'react-router-dom'

import LocalText from 'i18n/LocalText'
import DataProvider from 'containers/RPDataProvider'
import apis from 'utils/apis'
import { pageSize } from 'constants/config'
import TxCount from 'components/txs/TxCount'
import { push } from 'react-router-redux'

import styles from 'containers/Common.scss'

const mapStateToProps = ({ nodes: { count } }) => {
  return {
    count
  }
}

export default connect(mapStateToProps)(function Nodes(props) {
  const urlPath = location.pathname.split('/').filter(item => item)
  let currentIndex = 1
  if (urlPath.length > 0 && !isNaN(parseInt(urlPath[urlPath.length - 1], 10))) {
    currentIndex = parseInt(urlPath[urlPath.length - 1], 10)
  }

  return (
    <div>
      <DataProvider
        options={{
          path: apis.nodesCount,
          ns: 'nodes',
          field: 'count'
        }}
        render={data => (
          <TxCount id="snSubTitle" context={data} dispatch={props.dispatch} />
        )}
      />

      <DataProvider
        options={{
          path: `${apis.nodes}?offset=${(currentIndex - 1) *
            pageSize}&limit=${pageSize}`,
          ns: 'nodes',
          field: 'nodes'
        }}
        render={data => (
          <PagedTable
            size={props.count && props.count.data ? props.count.data.Total : 0}
            context={data}
            currentIndex={currentIndex}
            dispatch={props.dispatch}
            basePath={`${apis.nodes}?limit=${pageSize}`}
          />
        )}
      />
    </div>
  )
})

function PagedTable(props) {
  const [current, setCurrent] = useState(props.currentIndex)

  const handlePageChange = e => {
    setCurrent(e)
    props.dispatch(push(`/super-node/${e}`))
    props.dispatch({
      type: 'dataRelay/fetchData',
      payload: {
        path: props.basePath + `&offset=${(parseInt(e, 10) - 1) * pageSize}`,
        ns: 'nodes',
        field: 'nodes'
      }
    })
  }
  const columns = [
    {
      title: <LocalText id="snColumn1" />,
      dataIndex: 'ranking',
      key: 'ranking'
    },
    {
      title: <LocalText id="snColumn2" />,
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: item => <Link to="">{item}</Link>
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
      dataIndex: 'status'
    }
  ]

  const data = []
  if (
    props.context &&
    props.context.data &&
    Array.isArray(props.context.data)
  ) {
    const { Votes: totalVotes } = props.context.data.reduce((a, b) => ({
      Votes: parseInt(a.Votes, 10) + parseInt(b.Votes, 10)
    }))

    props.context.data.forEach((item, i) => {
      data.push({
        key: item.Address + i,
        ranking: i + 1,
        name: item.Vname,
        votes: item.Votes,
        percentage: Math.round((item.Votes / totalVotes) * 10000) / 100 + '%',
        status: item.Status
      })
    })
  }

  return (
    <Table
      className={styles.table}
      columns={columns}
      dataSource={data}
      pagination={{
        position: 'both',
        pageSize,
        total: props.size,
        showQuickJumper: true,
        onChange: handlePageChange,
        current
      }}
    />
  )
}
