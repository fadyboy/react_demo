var axios = require('axios');

// for use of a github client id and secret key
// var id = '';
// var secret = '';
// var params = '?client_id=' + id + '&client_secret=' + secret;

function getProfile(username){
	return axios.get('https://api.github.com/users/' + username)
	.then((user)=>{
		return user.data;
	}).catch(handleError);
}

function getRepos(username){
	return axios.get('https://api.github.com/users/' + username + '/repos');
}

function getStarCount(repos){
	return repos.data.reduce((count, repo)=>{
		return count + repo.stargazers_count;
	}, 0);
}

function calculateScore(profile, repos){
	var followers = profile.followers;
	var totalStars = getStarCount(repos);

	return (followers * 3) + totalStars;
}

function handleError(error){
	console.warn(error);
	return null;
}

function getUserData(player){
	return axios.all([
			getProfile(player),
			getRepos(player)
		]).then((data)=>{
			var profile = data[0];
			var repos = data[1];

			return {
				profile: profile,
				score: calculateScore(profile, repos)
			}
		})
}

function sortPlayers(players){
	return players.sort((a, b)=>{
		return b.score - a.score;
	});
}

module.exports = {
	battle: (players)=>{
		return axios.all(players.map(getUserData))
			.then(sortPlayers)
			.catch(handleError)
	},
	fetchPopularRepos: (lang)=>{
		var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + lang + 
			'&sort=&stars&order=desc&type=Repositories');
			
		return axios.get(encodedURI)
			.then((response)=>{
				return response.data.items;
			})
	}
}