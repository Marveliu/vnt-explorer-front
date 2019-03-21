import React from 'react'
import { connect } from 'react-redux'
import Title from 'components/Title'
import { Table, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'

import LocalText from 'i18n/LocalText'
import DataProvider from 'containers/RPDataProvider'
import apis from 'utils/apis'
import { pageSize } from 'constants/config'

const mapStateToProps = ({ accounts: { count } }) => {
  return {
    count
  }
}

export default connect(mapStateToProps)(function Tokens(props) {
  const urlPath = location.pathname.split('/').filter(item => item)
  let currentIndex = 1
  if (urlPath.length > 0 && !isNaN(parseInt(urlPath[urlPath.length - 1], 10))) {
    currentIndex = parseInt(urlPath[urlPath.length - 1], 10)
  }

  return (
    <div>
      <DataProvider
        options={{
          path: apis.accountCount + '?isToken=1',
          ns: 'accounts',
          field: 'count'
        }}
        render={data => (
          <Title titleID="tlpTitle" subTitleID="tlpSubTitle" context={data} />
        )}
      />
      {props.count &&
        props.count.data &&
        props.count.data > 0 && (
          <DataProvider
            options={{
              path: `${apis.accounts}?isToken=1&offset=${(currentIndex - 1) *
                pageSize}&limit=${pageSize}`,
              ns: 'accounts',
              field: 'accounts'
            }}
            render={data => (
              <PagedTable
                size={props.count.data}
                context={data}
                dispatch={props.dispatch}
                currentIndex={currentIndex}
                changePath={path => props.dispatch(push(path))}
              />
            )}
          />
        )}
    </div>
  )
})

function PagedTable(props) {
  const handlePageChange = e => {
    if (e !== props.currentIndex) {
      props.changePath(`/contracts/${e}`)
    }
    props.dispatch({
      type: 'dataRelay/fetchData',
      payload: {
        path: `${apis.accounts}?isToken=1&offset=${(e - 1) *
          pageSize}&limit=${pageSize}`,
        ns: 'accounts',
        field: 'accounts'
      }
    })
  }

  console.log("props: ", props)

  const columns = [
    {
      title: <LocalText id="tlpTitle" />,
      dataIndex: 'address',
      key: 'address',
      // eslint-disable-next-line react/display-name
      render: addr => (
        <Link to={`/token/${addr}`}>
          <Icon type="project" /> {props.context.data.ContractName}
        </Link>
      )
    },
    {
      title: <LocalText id="clpColumn2" />,
      dataIndex: 'cname',
      key: 'cname'
    },
    {
      title: <LocalText id="clpColumn3" />,
      dataIndex: 'balance',
      key: 'balance'
    },
    {
      title: <LocalText id="clpColumn4" />,
      key: 'txCount',
      dataIndex: 'txCount'
    }
  ]

  const data = []
  if (
    props.context &&
    props.context.data &&
    Array.isArray(props.context.data)
  ) {
    props.context.data.forEach((item, i) => {
      data.push({
        key: item.Address + i,
        address: item.Address,
        cname: item.ContractName,
        balance: item.Balance,
        txCount: item.TxCount
      })
    })
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        position: 'both',
        pageSize,
        total: props.size,
        showQuickJumper: true,
        onChange: handlePageChange,
        current: props.currentIndex
      }}
    />
  )
}
