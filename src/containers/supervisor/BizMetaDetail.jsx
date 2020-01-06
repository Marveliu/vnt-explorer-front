import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PrimaryTitle from 'components/PrimaryTitle'
// import { Link } from 'react-router-dom'

import LocalText from 'i18n/LocalText'
import DataProvider from 'containers/RPDataProviderNew'
import BizMetaDetailTable from 'components/BaseTable'
import apis from 'utils/apis'

import withLang from 'i18n/withLang'
import { calcAge, formatTime } from 'utils/time'
// import r from 'constants/routes'

const mapStateToProps = ({ bizMetas: { bizMetaDetail } }) => {
  return {
    bizMetaDetail
  }
}

export default withLang(
  connect(mapStateToProps)(function BizMetaDetail(props) {
    // 父哈希值翻页
    useEffect(
      () => {
        props.dispatch({
          type: 'dataRelayNew/fetchData',
          payload: {
            path: `${apis.bizMeta}/${props.match.params.bizMeta}`,
            ns: 'bizMetas',
            field: 'bizMetaDetail'
          }
        })
      },
      [props.location.pathname]
    )

    return (
      <div>
        <PrimaryTitle
          id="bmtdTitle"
          options={{
            suffix: `#${props.match.params.bizMeta}`,
            requireCopy: false
          }}
        />

        <DataProvider
          options={{
            path: `${apis.bizMeta}/${props.match.params.bizMeta}`,
            ns: 'bizMetas',
            field: 'bizMetaDetail'
          }}
          render={data => <DetailTable context={data} lang={props.language} />}
        />
      </div>
    )
  })
)

function DetailTable(props) {
  const columns = [
    {
      title: <LocalText id="bmtdTitle" />,
      dataIndex: 'fieldName',
      key: 'fieldName'
    },
    {
      title:
        props.context && props.context.data ? props.context.data.No : '-/-',
      dataIndex: 'value',
      key: 'value'
    }
  ]

  const data = []
  if (props.context && props.context.data) {
    const {
      No,
      BizName,
      BizType,
      Desc,
      Datas,
      Tasks,
      Timestamp,
    } = props.context.data
    // eslint-disable-next-line
    data.push({
      key: 'No',
      fieldName: <LocalText id="bmtdField1" />,
      value: No
    })
    data.push({
      key: 'BizName',
      fieldName: <LocalText id="bmtdField2" />,
      value: BizName
    })
    data.push({
      key: 'BizType',
      fieldName: <LocalText id="bmtdField3" />,
      value: BizType
    })
    data.push({
      key: 'Desc',
      fieldName: <LocalText id="bmtdField4" />,
      value: Desc
    })
    data.push({
      key: 'Datas',
      fieldName: <LocalText id="bmtdField5" />,
      value: Datas
    })
    data.push({
      key: 'Tasks',
      fieldName: <LocalText id="bmtdField6" />,
      value: Tasks
    })
    data.push({
      key: 'Timestamp',
      fieldName: <LocalText id="bmtdField7" />,
      value: `${calcAge(Timestamp, props.lang)} (${formatTime(Timestamp)})`
    })
  }

  return (
    <div>
      {props.context &&
        !props.context.isLoading &&
        !props.context.error && (
          <BizMetaDetailTable
            columns={columns}
            data={data}
            tableType="2colDetail"
            pagination={false}
          />
        )}
    </div>
  )
}
