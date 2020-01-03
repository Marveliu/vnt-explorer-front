import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PrimaryTitle from 'components/PrimaryTitle'
// import { Link } from 'react-router-dom'

import LocalText from 'i18n/LocalText'
import DataProvider from 'containers/RPDataProviderNew'
import ReportDetailTable from 'components/BaseTable'
import apis from 'utils/apis'

import withLang from 'i18n/withLang'
import { calcAge, formatTime } from 'utils/time'
// import r from 'constants/routes'

const mapStateToProps = ({ reports: { reportDetail } }) => {
  return {
    reportDetail
  }
}

export default withLang(
  connect(mapStateToProps)(function ReportDetail(props) {
    // 父哈希值翻页
    useEffect(
      () => {
        props.dispatch({
          type: 'dataRelayNew/fetchData',
          payload: {
            path: `${apis.report}/${props.match.params.report}`,
            ns: 'reports',
            field: 'reportDetail'
          }
        })
      },
      [props.location.pathname]
    )

    return (
      <div>
        <PrimaryTitle
          id="repdTitle"
          options={{
            suffix: `#${props.match.params.report}`,
            requireCopy: false
          }}
        />

        <DataProvider
          options={{
            path: `${apis.report}/${props.match.params.report}`,
            ns: 'reports',
            field: 'reportDetail'
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
      title: <LocalText id="repdTitle" />,
      dataIndex: 'fieldName',
      key: 'fieldName'
    },
    {
      title:
        props.context && props.context.data ? props.context.data.Id : '-/-',
      dataIndex: 'value',
      key: 'value'
    }
  ]

  const data = []
  if (props.context && props.context.data) {
    const {
      TimeStamp,
      MetaNo,
      ContractAddr,
      Data,
      BlockNumber,
      TxHash,
    } = props.context.data
    // eslint-disable-next-line
    //console.log(props.context.data)
    data.push({
      key: 'timeStamp',
      fieldName: <LocalText id="repdField1" />,
      value: `${calcAge(TimeStamp, props.lang)} (${formatTime(TimeStamp)})`
    })
    data.push({
      key: 'BlockNumber',
      fieldName: <LocalText id="repdField2" />,
      value: BlockNumber
    })
    data.push({
      key: 'TxHash',
      fieldName: <LocalText id="repdField3" />,
      value: TxHash.toLowerCase()
    })
    data.push({
      key: 'MetaNo',
      fieldName: <LocalText id="repdField4" />,
      value: MetaNo
    })
    data.push({
      key: 'ContractAddr',
      fieldName: <LocalText id="repdField5" />,
      value: ContractAddr.toLowerCase()
    })
    data.push({
      key: 'Data',
      fieldName: <LocalText id="repdField6" />,
      value: Data
    })
  }

  return (
    <div>
      {props.context &&
        !props.context.isLoading &&
        !props.context.error && (
          <ReportDetailTable
            columns={columns}
            data={data}
            tableType="2colDetail"
            pagination={false}
          />
        )}
    </div>
  )
}
