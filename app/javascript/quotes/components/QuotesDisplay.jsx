import React from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router';
import queryString from 'query-string';
import axios from 'axios';
import QuoteNavigation from './QuoteNavigation';
import Quotes from './Quotes';

class QuotesDisplay extends React.Component {
  constructor() {
    super()
    this.state = {
      quote: {},
      fireRedirect: false,
      modalOpen: false,
      submitQuote: {},
      inputQuote: '',
      inputAuthor: ''
    }
  }

  handleChange = (event) => {
  const name = event.target.name
  const value = event.target.value
  this.setState({
      [name]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    axios.post(`api/quotes`, {
      text: this.state.inputQuote,
      author: this.state.inputAuthor
    })
    .then( (res) => {
      this.setState({
        inputQuote: '',
        inputAuthor: '',
        modalOpen: false,
        submitQuote: res.data
      })
    })
    .then( () => {
      this.props.history.push(`/?quote=${this.state.submitQuote.id}`)
    })
  }

  fetchQuote(id) {
    axios.get(`api/quotes/${id}`)
      .then(response => {
        this.setState({ quote: response.data })
      })
      .catch(error => {
        console.error(error)
        this.setState({ fireRedirect: true })
      })
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  setQuoteIdFromQueryString(qs) {
    this.qsParams = queryString.parse(qs)
    if (this.qsParams.quote) {
      // assign quote ID from the URL's query string
      this.quoteId = Number(this.qsParams.quote)
    } else {
      this.quoteId = this.props.startingQuoteId
      // update URL in browser to reflect current quote in query string
      this.props.history.push(`/?quote=${this.quoteId}`)
    }
  }

  componentDidMount() {
    this.setQuoteIdFromQueryString(this.props.location.search)
    this.fetchQuote(this.quoteId)
  }

  componentWillReceiveProps(nextProps) {
    this.setQuoteIdFromQueryString(nextProps.location.search)
    this.fetchQuote(this.quoteId)
  }

  render() {
    const quote = this.state.quote
    const nextQuoteId = quote.next_id
    const previousQuoteId = quote.previous_id
    return (
      <div>
        <div className='quote-container'>
          {this.state.fireRedirect &&
            <Redirect to={'/'} />
          }

          {previousQuoteId != null ? <QuoteNavigation direction='previous' otherQuoteId={previousQuoteId} /> : null }

          < Quotes quote={this.state.quote} />

          {nextQuoteId != null ? <QuoteNavigation direction='next' otherQuoteId={nextQuoteId} /> : null}

          <div className='quote'>
            <div className='quote-open'>“</div>
            <div className='quote-close'>”</div>
            <div className='quote-text'>
              {quote.text}
            </div>
            <div className='quote-author'>
              <em>— {quote.author}</em>
            </div>
          </div>

          <QuoteNavigation direction='next' otherQuoteId={nextQuoteId} />

        </div>
        {this.state.quote.id !== parseInt(this.props.startingQuoteId, 10) &&
          <div id='footer'>
            <Link className='btn btn-primary' to={`/?quote=${this.props.startingQuoteId}`}>
              Back to Beginning
            </Link>
          </div>
        }
      </div >
    )
  }
}

export default QuotesDisplay
