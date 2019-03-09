import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import toastr from 'toastr';
import {
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from 'react-share';

// ACTIONS
import { getArticles } from '../../actions/ArticleActions';

// UTILS
import categories from '../../utils/categories';
import countryList from '../../utils/countries';

class Articles extends Component {
    state = {
        articles: [],
        selectedCategory: '',
        selectedCountry: '',
        search: ''
    }

    componentDidMount = () => {
        this.props.getArticles('', 'us', '')
            .then(() => this.setState({ articles: this.props.articles }));
    }

    categoryFilterChanges = (category) => {
        this.setState({ selectedCategory: category, search: '' }, () => {
            const { selectedCountry, selectedCategory } = this.state;
            this.props.getArticles('', selectedCountry['value'], selectedCategory['value'], '')
                .then(() => this.setState({ articles: this.props.articles }, () =>
                    this.props.articles.length > 0
                    ? ''
                    : toastr.error('No articles found for your selected filter.')
                ))
                .catch(() => toastr.error(this.props.message));
        });
    }

    countryFilterChanges = (country) => {
        this.setState({ selectedCountry: country, search: '' }, () => {
            const { selectedCountry, selectedCategory } = this.state;
            this.props.getArticles('', selectedCountry['value'], selectedCategory['value'], '')
                .then(() => this.setState({ articles: this.props.articles }, () =>
                    this.props.articles.length > 0
                    ? ''
                    : toastr.error('No articles found for your selected filter.')
                ))
                .catch(() => toastr.error(this.props.message));
        });
    }

    handleSearchChange = (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    }

    submitSearch = (e) => {
        e.preventDefault();
        const { search } = this.state;
        this.props.getArticles('', '', '', search)
            .then(() => this.setState({ articles: this.props.articles }, () =>
                this.props.articles.length > 0
                ? ''
                : toastr.error('No articles found for your selected filter.')
            ))
            .catch(() => toastr.error(this.props.message));
    }

    render = () => {
        const {
            articles,
            selectedCategory,
            selectedCountry,
            search
        } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-5 mx-auto my-3">
                        <h1 className="display-4 font-weight-normal">
                            News from 
                        </h1>
                    </div>
                </div>

                <div className="row mt-3 mb-5">
                    <h5 className="col-lg-12">Search</h5>
                    <div className="col-lg-11 mb-2">
                        <input
                            type="text"
                            name="search"
                            value={search}
                            onChange={this.handleSearchChange}
                            className="form-control" />
                    </div>
                    <div className="col-lg-1 mb-2">
                        <button className="btn btn-info" onClick={this.submitSearch} type="submit">
                            Submit
                        </button>
                    </div>
                </div>
                <div className="row mt-3 mb-5">
                    <h5 className="col-lg-12">Filter by:</h5>
                    <div className="col-xs-12 col-md-4">
                        <div className="row">
                            <span className="col-lg-12">Category: </span>
                            <Select
                                className="col-lg-12"
                                name="categories"
                                value={selectedCategory}
                                onChange={this.categoryFilterChanges}
                                options={categories} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <div className="row">
                            <span className="col-lg-12">Country: </span>
                            <Select
                                className="col-lg-12"
                                name="countries"
                                value={selectedCountry}
                                onChange={this.countryFilterChanges}
                                options={countryList} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    {
                        articles.map(article =>
                            <div className="col-md-6 mb-4" key={article.url}>
                                <div className="card" style={{ maxWidth: 540 + 'px' }}>
                                    <div className="row no-gutters">
                                        <div className="col-md-4">
                                        <img src={article.urlToImage} className="card-img" alt="..." />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                                    <h5 className="card-title">{article.title}</h5>
                                                </a>
                                                <p className="card-text">{article.description}</p>
                                                <p className="card-text">Date <small className="text-muted">
                                                    {article.publishedAt.slice(0, 10)} {article.publishedAt.slice(12, 19)}
                                                </small></p>
                                                <p className="card-text">Author <small className="text-muted">{article.author}</small></p>
                                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                                    Read more >>>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <FacebookShareButton url={article.url} title={article.title}>
                                                <FacebookIcon size={32} round={true} />
                                            </FacebookShareButton>
                                        </div>
                                        <div className="m-2">
                                            <TwitterShareButton url={article.url} title={article.title}>
                                                <TwitterIcon size={32} round={true} />
                                            </TwitterShareButton>
                                        </div>
                                        <div className="m-2">
                                            <WhatsappShareButton url={article.url} title={article.title}>
                                                <WhatsappIcon size={32} round={true} />
                                            </WhatsappShareButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ articles }) => ({
    articles
});

export default connect(mapStateToProps, {
    getArticles
})(Articles);
