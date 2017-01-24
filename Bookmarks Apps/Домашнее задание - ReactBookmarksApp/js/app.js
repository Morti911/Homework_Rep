
var { Router,
    Route,
    IndexRoute,
    IndexLink,
    Link } = ReactRouter;

var element = document.querySelector("#container");

var App = React.createClass({
    render: function() {
        return (
            <div>
                <h1>Bookmarks APP</h1>
                <ul className="header">
                    <li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
                    <li><Link to="/stuff" activeClassName="active">Add bookmark</Link></li>
                    <li><Link to="/contact" activeClassName="active">Bookmarks List</Link></li>
                </ul>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

var Home = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Wellcome</h2>
                <p>To Bookmarks App</p>

            </div>
        );
    }
});


var Form = React.createClass({
    addBookmark: function(e) {
        var name = ReactDOM.findDOMNode(this.refs.name).value,
            url = ReactDOM.findDOMNode(this.refs.url).value,
            desc = ReactDOM.findDOMNode(this.refs.desc).value;

        var item = [{
            id: model.length + 1,
            name: name,
            url: url,
            desc: desc
        }];

        window.ee.emit('List.add', item);
    },
    render: function() {
        return (
            <div className="form-group">
                <input type='text' className="form-control" placeholder='name' ref="name"/>
                <input type='text' className="form-control" placeholder='url' ref="url" />
                <input type='text' className="form-control" placeholder='desc' ref="desc" />
                <button className="btn btn-primary" onClick={this.addBookmark}>Add Bookmark</button>
            </div>
        );
    }
});


window.ee = new EventEmitter();

var Table = React.createClass({
    getInitialState: function() {
        return {
            bookmarks: model
        };
    },
    componentDidMount: function() {

        var self = this;
        window.ee.addListener('List.add', function(item) {
            var newBookmark = self.state.bookmarks.concat(item);

            if(self.isMounted()) {                       // This is bad idea(
                self.setState({bookmarks: newBookmark});
            }

        });
    },
    componentWillUnmount: function() {
        this.isUnmounted = true;
        window.ee.removeListener('List.add');

    },
    render: function () {
        return (
            <table className="table">
                <thead>
                <tr className="headerClass">
                    <td>ID</td>
                    <td>Name</td>
                    <td>Url</td>
                    <td>Description</td>
                </tr>
                </thead>
                <List data={this.state.bookmarks}/>
            </table>
        )
    }
});

var List = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function() {

        var data = this.props.data;

        var row = data.map(function(item, index) {
            return (
                <Bookmark key={index} data={item} />
            )
        });

        return (
            <tbody>
            {row}
            </tbody>
        );
    }
});

var Bookmark = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            url: React.PropTypes.string.isRequired,
            desc: React.PropTypes.string.isRequired
        })
    },
    render: function() {
        var id = this.props.data.id,
            name = this.props.data.name,
            url = this.props.data.url,
            desc = this.props.data.desc;

        return (
            <tr>
                <td>{id}</td>
                <td>{name}</td>
                <td>{url}</td>
                <td>{desc}</td>
            </tr>
        )
    }
});

var tableWrapper = React.createClass({
    render: function () {
        return (
            <table  />
        );
    }
});

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="stuff" component={Form} />
            <Route path="contact" component={Table} />
        </Route>
    </Router>,
    element
);

