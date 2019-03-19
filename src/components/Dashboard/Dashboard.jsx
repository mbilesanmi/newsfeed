import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import firebase from 'firebase';

// CONFIG
import { db } from '../../config/Fire';

// UTILS
import { convertUrlToStr } from '../../utils/utils';

class Dashboard extends Component {
    state = {
        bookmarks: {},
        fav_sources: {},
        user_id: ''
    }

    componentDidMount = () => {
        this.setState({ user_id: localStorage.getItem('user') }, () => {
            if (this.state.user_id) {
                this.getBookmarks();
                this.getFavSources();
            } else {
                toastr.error('Unauthorized access');
                this.props.history.push('login')
            }
        });
    }

    getBookmarks = () => {
        db.collection('bookmarks').doc(this.state.user_id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({ bookmarks: doc.data() });
                } else {
                    toastr.error('No bookmarks found');
                }
            })
            .catch(function(error) {
                toastr.error('Error fetching bookmarks');
                console.log(error, 'err');
            });
    }

    getFavSources = () => {
        db.collection('fav_sources').doc(this.state.user_id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({ fav_sources: doc.data() });
                } else {
                    toastr.error('No favorite sources found');
                }
            })
            .catch(function(error) {
                toastr.error('Error fetching favs:', error);
                console.log(error, 'err');
            });
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

    removeFavorite = (e) => {
        e.preventDefault();
        const { user_id } = this.state;
        const { name } = e.target;

        db.collection('fav_sources').doc(user_id).update({
            [name]: firebase.firestore.FieldValue.delete(),
        })
            .then(() => {
                toastr.success('Source unfavourited!');
                this.getFavSources();
            })
            .catch(() => toastr.error('Could\'t unfavourite source!'));
    }

    render = () => {
        const {
            bookmarks,
            fav_sources
        } = this.state;

        const sources = Object.values(fav_sources);
        const bkmarks = Object.values(bookmarks);


        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-12 mx-auto my-3">
                        <h2 className="font-weight-normal">Your Favorite Sources</h2>
                    </div>
                </div>

                <div className="row">
                    {
                        sources.map(source =>
                            <div className="col-sm-12 col-md-4 col-lg-3 mb-3" key={source.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{source.name}</h5>
                                        <p className="card-text">Category: {source.category}</p>
                                        <a href={source.url} className="mr-1" target="_blank" rel="noopener noreferrer">
                                            View Source
                                        </a>
                                        <Link className="" to={`source/${source.id}`}>
                                            See news
                                        </Link>
                                        <button
                                            className="fas fa-heart"
                                            name={source.id}
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="bottom"
                                            title="Remove fav"
                                            onClick={this.removeFavorite} />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-12 mx-auto my-3">
                        <h2 className="font-weight-normal">Your Bookmarks</h2>
                    </div>
                </div>

                <div className="row">
                    {
                        bkmarks.map(article =>
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
                                                <button
                                                    className="fas fa-bookmark"
                                                    type="button"
                                                    name={article.url}
                                                    value={article.title}
                                                    data-toggle="tooltip"
                                                    data-placement="bottom"
                                                    title="Remove Bookmark"
                                                    onClick={this.unbookmarkArticle} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </>
        )
    }
}

export default Dashboard;
