import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'

import Copier from 'components/Copier'
import withLang from 'i18n/withLang'

import styles from 'components/PrimaryTitle.scss'

class PrimaryTitle extends Component {
  constructor(props) {
    super(props)
    this.copyRef = React.createRef()
  }

  handleCopy = () => {
    this.copyRef.current.select()
    document.execCommand('copy')
    message.info('Copied!')
  }

  render() {
    const { id, locale, language } = this.props
    let Title = null
    if (!this.props.options) {
      Title = <h2 className={styles.title}>{locale[language][id]}</h2>
    } else {
      const { suffix, requireCopy, requireQR } = this.props.options
      if (!requireCopy) {
        Title = (
          <h2 className={styles.title}>
            {locale[language][id] + ` ${suffix}`}
          </h2>
        )
      } else if (!requireQR) {
        // 只有复制
        Title = (
          <div>
            <p className={styles.title}>
              {locale[language][id]}
              <Copier
                text={suffix}
                copyRef={this.copyRef}
                textStyle={styles.data}
              />
            </p>
          </div>
        )
      } else {
        // TODO: 复制加二维码弹窗
      }
    }

    return Title
  }
}

PrimaryTitle.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.shape({
    suffix: PropTypes.string.isRequired,
    requireCopy: PropTypes.bool.isRequired,
    requireQR: PropTypes.bool.isRequired
  }),
  locale: PropTypes.shape({
    cn: PropTypes.object.isRequired,
    en: PropTypes.object.isRequired
  }).isRequired,
  language: PropTypes.string.isRequired
}

export default withLang(PrimaryTitle)
