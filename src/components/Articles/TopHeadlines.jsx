import React, { Component } from 'react';
import { connect } from 'react-redux';

// ACTIONS
import { getArticles } from '../../actions/ArticleActions';

// UTILS
import categories from '../../utils/categories';
import countryList from '../../utils/countries';

class Articles extends Component {
    state = {
        articles: [],
        selectedCategory: '',
        selectedCountry: 'us'
    }

    componentDidMount = () => {
        const { selectedCountry } = this.state;

        this.props.getArticles('', '', selectedCountry)
            .then(() => this.setState({ articles: this.props.articles }));
    }

    render = () => {
        const { articles } = this.state;

        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-5 mx-auto my-3">
                        <h1 className="display-4 font-weight-normal">News from </h1>
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
