var React = require('react')

var Main = require('./main.jsx')
var Spinner = require('./spinner.jsx')
var Github = require('./github.jsx')

var Future = require('data.future')
var R = require('ramda')

var My = require('../utils/myfunctors')
var GHConst = require('../utils/constants')

var Dashboard = React.createClass({
    getInitialState() {
        return {isLoading: true}    
    },
    componentDidMount() {                        
        var _My = new My()
        var L = _My.MakeLenses(GHConst.githubApiFields)               
        
        var getGithub = url => new Future(function(reject, response) {               
            $.getJSON(url)
            .done(function(data) {
                response(data)                    
            })
            .fail(function(error) {
                reject(error)
            })
        })
        
        
        var githubUrl = R.concat(GHConst.baseUrl, this.props.data)        
        
        var context = this
        
        var displayError = error => { context.setState({error, isLoading: false, id: this.props.data }) }        
        var displayData = data => { context.setState({
            error: null, 
            isLoading: false, 
            avatar: L.avatar_url.get(data), 
            id: L.id.get(data),
            name: L.name.get(data),
            login: L.login.get(data),
            company: L.company.get(data),
            location: L.location.get(data),
            followers: L.followers.get(data),
            following: L.following.get(data),
            email: L.email.get(data),
            bio: L.bio.get(data),
            public_repos: L.public_repos.get(data)
        })}
        
        getGithub(githubUrl).fork(displayError, displayData)
    },
    
    render() {
                
        return ((context, props, state) => {
            var _My = new My()
            var L = _My.MakeLenses(['isLoading'])
                                
            var show = R.ifElse(L.isLoading, s => <Spinner />, s => <Github data={{githubData: s}} />)
            return show(state)                                    
            
        })(this, this.props, this.state)          
    }
})

module.exports = Dashboard