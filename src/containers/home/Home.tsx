import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import DashBoardIcon from 'material-ui/svg-icons/action/dashboard';
import PostListIcon from 'material-ui/svg-icons/action/list';
import LabelIcon from 'material-ui/svg-icons/action/label';
import CommentIcon from 'material-ui/svg-icons/communication/comment';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
import MenuLink from '../../components/menuLink/MenuLink';
import DashBoard from '../dashboard/components/DashBoard';
import PostManage from '../posts/components/PostManage';
import LabelManage from '../labels/components/LabelManage';
import CommentManage from '../comments/components/CommentManage';
import ProjectManage from '../projects/components/ProjectManage';
import PrivateRouter from './PrivateRouter';
import './index.css';

//const PADDING = 30;

// const style = {
//     height: 100,
//     width: 100,
//     margin: 20,
//     textAlign: 'center',
//     display: 'inline-block',
// };

export interface AppState {
    drawerOpen: boolean;
}

class Home extends React.Component<object, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            drawerOpen: true
        };
    }

    handleClick = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        });
    };


    render() {
        return (
            <div>
                <AppBar
                    title="管理后台"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{ zIndex: 9999 }}
                    onLeftIconButtonTouchTap={this.handleClick}
                />
                <div style={{
                    backgroundColor: 'rgb(237, 236, 236)',
                    display: 'flex',
                    flex: '1 1 0%'
                }}>
                    <Drawer
                        containerStyle={{ top: 64 }}
                        open={this.state.drawerOpen}
                    >
                        <MenuItem primaryText={<MenuLink to='/' linkText='主页' />} leftIcon={<DashBoardIcon />} />
                        <MenuItem primaryText={<MenuLink to='/labels' linkText='标签' />} leftIcon={<LabelIcon />} />
                        <MenuItem primaryText={<MenuLink to='/posts' linkText='文章' />} leftIcon={<PostListIcon />} />
                        <MenuItem primaryText={<MenuLink to='/comments' linkText='评论' />} leftIcon={<CommentIcon />} />
                        <MenuItem primaryText={<MenuLink to='/projects' linkText='项目' />} leftIcon={<CommentIcon />} />
                        <MenuItem primaryText={<MenuLink to='/login' linkText='注销' />} leftIcon={<LogoutIcon />} onClick={() => sessionStorage.removeItem('user')} />
                    </Drawer>
                    <div className='Home-container' style={{ left: this.state.drawerOpen ? 256 : 0 }}>
                        <PrivateRouter exact path="/" component={DashBoard} />
                        <PrivateRouter path="/labels" component={LabelManage} />
                        <PrivateRouter path="/posts" component={PostManage} />
                        <PrivateRouter path="/comments" component={CommentManage} />
                        <PrivateRouter path="/projects" component={ProjectManage} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;