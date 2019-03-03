// LIBRARIES
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import toastr from 'toastr';

// STYLING

// ACTIONS
import { getSources } from '../../actions/SourceActions';

// COMPONENTS

// UTILS
import categories from '../../utils/categories';
import countryList from '../../utils/countries';
import languages from '../../utils/languages';

class Sources extends Component {
    state = {
        countries: [],
        sources: [],
        selectedLanguage: '',
        selectedCountry: '',
        selectedCategory: ''
    };

    componentDidMount = () => {
        this.props.getSources()
            .then(() => this.setState({ sources: this.props.sources }));
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

    render = () => {
        const {
            selectedCategory,
            selectedCountry,
            selectedLanguage,
            sources
        } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-5 mx-auto my-3">
                        <h1 className="display-4 font-weight-normal">Sources</h1>
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
