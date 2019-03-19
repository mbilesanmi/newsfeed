// LIBRARIES
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import toastr from 'toastr';
import firebase from 'firebase';
import _ from 'lodash';

// STYLING

// ACTIONS
import { getSources } from '../../actions/SourceActions';

// COMPONENTS

// UTILS
import categories from '../../utils/categories';
import countryList from '../../utils/countries';
import languages from '../../utils/languages';

// CONFIG
import { db } from '../../config/Fire';

class Sources extends Component {
    state = {
        countries: [],
        sources: [],
        fav_sources: {},
        selectedLanguage: '',
        selectedCountry: '',
        selectedCategory: '',
        user_id: ''
    };

    componentDidMount = () => {
        this.props.getSources()
            .then(() => {
                this.setState({
                    user_id: localStorage.getItem('user'),
                    sources: this.props.sources
                }, () => {
                    if (this.state.user_id) {
                        this.getFavorites();
                    } 
                });
            });
    }

    getFavorites = () => {
        db.collection('fav_sources').doc(this.state.user_id)
            .get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({ fav_sources: doc.data() });
                }
            })
            .catch(function(error) {
                toastr.error('Error fetching favs:', error);
                console.log(error, 'err');
            });
    }

    categoryFilterChanges = (category) => {
        this.setState({ selectedCategory: category }, () => {
            const { selectedCountry, selectedLanguage, selectedCategory } = this.state;
            this.props.getSources(selectedCountry['value'], selectedLanguage['value'], selectedCategory['value'])
                .then(() => this.setState({ sources: this.props.sources }, () =>
                    this.props.sources.length > 0
                    ? ''
                    : toastr.error('No sources found for your selected filter.')
                ))
                .catch(() => toastr.error(this.props.message));
        });
    }

    countryFilterChanges = (country) => {
        this.setState({ selectedCountry: country }, () => {
            const { selectedCountry, selectedLanguage, selectedCategory } = this.state;
            this.props.getSources(selectedCountry['value'], selectedLanguage['value'], selectedCategory['value'])
                .then(() => this.setState({ sources: this.props.sources }, () =>
                    this.props.sources.length > 0
                    ? ''
                    : toastr.error('No sources found for your selected filter.')
                ))
                .catch(() => toastr.error(this.props.message));
        });
    }

    languageFilterChanges = (language) => {
        this.setState({ selectedLanguage: language }, () => {
            const { selectedCountry, selectedLanguage, selectedCategory } = this.state;
            this.props.getSources(selectedCountry['value'], selectedLanguage['value'], selectedCategory['value'])
                .then(() => this.setState({ sources: this.props.sources }, () =>
                    this.props.sources.length > 0
                    ? ''
                    : toastr.error('No articles found for your selected filter.')
                ))
                .catch(() => toastr.error(this.props.message));
        });
    }

    markFavorite = (e) => {
        e.preventDefault();
        const { user_id } = this.state;
        const { name } = e.target;

        const source = _.find(this.state.sources, { 'id': name })

        db.collection('fav_sources').doc(user_id).set({
            [name]: source,
        }, { merge: true })
            .then(() => {
                toastr.success('Source favourited!');
                this.getFavorites();
            })
            .catch(() => toastr.error('Could\'t favourite source!'));
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
                this.getFavorites();
            })
            .catch(() => toastr.error('Could\'t unfavourite source!'));
    }

    render = () => {
        const {
            fav_sources,
            selectedCategory,
            selectedCountry,
            selectedLanguage,
            sources,
            user_id
        } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-12 mx-auto my-3">
                        <h2 className="font-weight-normal">Sources</h2>
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
                    <div className="col-xs-12 col-md-4">
                        <div className="row">
                            <span className="col-lg-12">Language: </span>
                            <Select
                                className="col-lg-12"
                                name="language"
                                value={selectedLanguage}
                                onChange={this.languageFilterChanges}
                                options={languages} />
                        </div>
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
                                        {
                                            !user_id ?  ''
                                            : source.id in fav_sources ?
                                            <button
                                                className="fas fa-heart"
                                                name={source.id}
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Remove fav"
                                                onClick={this.removeFavorite} />
                                            : <button
                                                className="far fa-heart"
                                                name={source.id}
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Mark as fav"
                                                onClick={this.markFavorite} />
                                            
                                        }
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

const mapStateToProps = ({ message, sources }) => ({
    message,
    sources
});

export default connect(mapStateToProps, {
    getSources
})(Sources);
