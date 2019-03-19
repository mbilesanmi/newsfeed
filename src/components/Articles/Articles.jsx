import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import firebase from 'firebase';
import _ from 'lodash';

// ACTIONS
import { getArticles } from '../../actions/ArticleActions';

// CONFIG
import { db } from '../../config/Fire';

// UTILS
import { convertUrlToStr } from '../../utils/utils';

class Articles extends Component {
    state = {
        articles: [],
        bookmarks: {},
        user_id: ''
    }

    componentDidMount = () => {
        const { sourceId } = this.props.match.params;

        this.props.getArticles(sourceId)
            .then(() => this.setState({
                    articles: this.props.articles,
                    user_id: localStorage.getItem('user'),
                }, () => {
                    if (this.state.user_id) {
                        this.getBookmarks();
                    }
                }));
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
            .catch(() => toastr.error('Could\'t unfavourite source!'));
    }

    render = () => {
        const {
            articles,
            bookmarks,
            user_id
        } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-12 mx-auto my-3">
                        {
                            articles.length > 0 ?
                            <h2 className="font-weight-normal">News from {articles[0]['source']['name']}</h2>
                            : <h2 className="font-weight-normal">News</h2>
                        }
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
                                                        value={article.title}
                                                        data-toggle="tooltip"
                                                        data-placement="bottom"
                                                        title="Bookmark Article"
                                                        onClick={this.bookmarkArticle} />
                                                }
                                            </div>
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
