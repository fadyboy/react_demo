var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');


function SelectedLanguage(props){
	var languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Python"];

	return (
			<ul className="languages">{languages.map((lang)=>{
					return (
						<li 
						key={lang} 
						onClick={props.onSelect.bind(null, lang)}
						style={lang === props.selectedLanguage ? {color: '#d0021b'} : null }>
						{lang}
						</li>
						)
				})}
				</ul>
		)
}


function RepoGrid(props){
	return (
			<ul className="popular-list">
				{props.repos.map((repo, index)=>{
					return (
							<li key={repo.name} className="popular-item">
								<div className="">#{index + 1}</div>
								<ul className="space-list-items">
									<li>
										<img
										  className="avatar" 
										  src={repo.owner.avatar_url}
										  alt={"Avatar for " + repo.owner.login} />
									</li>
									<li>
										<a href={repo.html_url}>{repo.name}</a>
									</li>
									<li>@{repo.owner.login}</li>
									<li>{repo.stargazers_count} stars</li>
								</ul>
							</li>
						)
				})}
			</ul>
		)
}

SelectedLanguage.propTypes = {
	selectedLanguage: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired
}

RepoGrid.propTypes = {
	repos: PropTypes.array.isRequired
}


class Popular extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			selectedLanguage: "All",
			repos: null  
		};
		this.updateLanguage = this.updateLanguage.bind(this);
	}
	updateLanguage(lang){
		this.setState(()=>{
			return {
				selectedLanguage: lang
			}
		});
		api.fetchPopularRepos(lang)
			.then((repos)=>{
				this.setState(()=>{
					return {
						repos: repos
					}
				})
			})
	}
	componentDidMount(){
		this.updateLanguage(this.state.selectedLanguage);
	}
	render(){
		
		return (
				<div>
					<SelectedLanguage 
						selectedLanguage={this.state.selectedLanguage}
						onSelect={this.updateLanguage} />
						{!this.state.repos ? <Loading text="checking" speed={100} /> : <RepoGrid repos={this.state.repos}/>}
					
				</div>
		)
	}
}

module.exports = Popular;