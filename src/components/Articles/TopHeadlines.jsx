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
import firebase from 'firebase';
import _ from 'lodash';

// ACTIONS
import { getArticles } from '../../actions/ArticleActions';

// UTILS
import categories from '../../utils/categories';
import countryList from '../../utils/countries';
import { convertUrlToStr } from '../../utils/utils';

// CONFIG
import { db } from '../../config/Fire';

class Articles extends Component {
    state = {
        articles: [],
        bookmarks: {},
        selectedCategory: '',
        selectedCountry: '',
        search: '',
        user_id: ''
    }

    componentDidMount = () => {
        this.props.getArticles('', 'us', '')
            .then(() => this.setState({
                articles: this.props.articles,
                user_id: localStorage.getItem('user'),
            }, () => {
                if (this.state.user_id) {
                    this.getBookmarks();
                }
            }));
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

    getBookmarks = () => {
        db.collection('bookmarks').doc(this.state.user_id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({ bookmarks: doc.data() });
                }
            })
            .catch(function(error) {
                toastr.error('Error fetching bookmarks');
                console.log(error, 'err');
            });
    }

    bookmarkArticle = (e) => {
        e.preventDefault();
        const { user_id } = this.state;
        const { name } = e.target;

        const article = _.find(this.state.articles, { 'url': name })

        db.collection('bookmarks').doc(user_id).set({
            [convertUrlToStr(name)]: article,
        }, { merge: true })
            .then(() => {
                toastr.success('Article bookmarked!');
                this.getBookmarks();
            })
            .catch(() => toastr.error('Could\'t bookmark article!'));
    }

    unbookmarkArticle = (e) => {
        e.preventDefault();
        const { user_id } = this.state;
        const { name } = e.target;

        db.collection('bookmarks').doc(user_id).update({
            [convertUrlToStr(name)]: firebase.firestore.FieldValue.delete(),
        })
            .then(() => {
                toastr.success('Article unbookmarked!');
                this.getBookmarks();
            })
            .catch(() => toastr.error('Could\'t unbookmark article!'));
    }

    render = () => {
        const {
            articles,
            bookmarks,
            selectedCategory,
            selectedCountry,
            search,
            user_id
        } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-12 mx-auto my-3">
                        <h2 className="font-weight-normal">
                            Top Headlines
                        </h2>
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
                                        <div className="m-2">
                                            {
                                                !user_id ?  ''
                                                : convertUrlToStr(article.url) in bookmarks ?
                                                <button
                                                    className="fas fa-bookmark"
                                                    type="button"
                                                    name={article.url}
                                                    value={article.title}
                                                    data-toggle="tooltip"
                                                    data-placement="bottom"
                                                    title="Remove Bookmark"
                                                    onClick={this.unbookmarkArticle} />
                                                : <button
                                                    className="far fa-bookmark"
                                                    type="button"
                                                    name={article.url}
                                                    data-toggle="tooltip"
                                                    data-placement="bottom"
                                                    title="Bookmark Article"
                                                    onClick={this.bookmarkArticle} />
                                            }
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
