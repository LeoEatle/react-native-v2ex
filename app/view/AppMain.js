/**
 * Created by haifeng on 16/12/29.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    DrawerLayoutAndroid,
    Platform,
    Animated
} from 'react-native';

import InfoListView from './InfoListView';
import { connect } from 'react-redux';
import { fetchList } from '../action/fetchListAction';
import SideMenu from 'react-native-side-menu'
import Menu from '../view/Menu';

const headerHeight = (Platform.OS === 'ios' ? 65 : 55)
const headerPaddingTop = (Platform.OS === 'ios' ? 35 : 20)


var { height, width } = Dimensions.get('window');


class AppMain extends Component {
    constructor(props) {
        super(props);
        this.onMenuItemSelected = this.onMenuItemSelected.bind(this);
        this.changeRightSlider = this.changeRightSlider.bind(this);
        this.state = {
            isOpen: false,
            maskShow: false,
            rightIsOpen: false,
            selectedItem: 'Latest',
            fadeAnim: new Animated.Value(0)
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(fetchList('最新'));
    }

    toggleLeft() {
        if (this.state.isOpen == false) {
            this.setState({
                maskShow: true,
            });

        } else {
            setTimeout(() => {
                this.setState({
                    maskShow: false,
                });
            }, 500)
        }

        this.setState({
            isOpen: !this.state.isOpen,
        });


    }
    toggleRight() {
        this.setState({
            rightIsOpen: !this.state.rightIsOpen,
        });
    }

    updateMenuState(isOpen) {
        this.setState({ isOpen });
        if (isOpen == 1) {
            Animated.timing(
                this.state.fadeAnim, {
                    toValue: .6,
                    duration: 500
                },
            ).start();
        } else {
            Animated.timing(
                this.state.fadeAnim, {
                    toValue: 0,
                    duration: 500
                },
            ).start();
        }
    }
    changeRightSlider = () => {
        this.setState({
            rightIsOpen: false
        });
    };
    toggleLeftAndroid = () => {
        this.refs['DRAWER'].openDrawer()
    }

    onMenuItemSelected = (item) => {
        const { dispatch } = this.props;
        this.setState({
            isOpen: false,
            selectedItem: item,
        });
        if (item == this.state.selectedItem) {
            return
        } else {
            dispatch(fetchList('最新'));
        }
    };



    render() {
        const { ListInfo } = this.props;
        const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
        return (
            <View style={{ flex: 1 }}>
                {Platform.OS === 'ios' ?
                    <SideMenu
                        menu={menu}
                        openMenuOffset={250}
                        menuPosition="left"
                        isOpen={this.state.isOpen}
                        onChange={(isOpen) => this.updateMenuState(isOpen)}>
                        {this.state.maskShow ?
                            <TouchableWithoutFeedback onPress={() => this.toggleLeft()}>
                                <Animated.View
                                    style={{
                                        opacity: this.state.fadeAnim,
                                        width: width,
                                        height: height,
                                        backgroundColor: '#333',
                                        position: 'absolute',
                                        zIndex: 200
                                    }}>
                                </Animated.View>
                            </TouchableWithoutFeedback> : <View />
                        }
                        <View style={styles.listHeader}>
                            <TouchableOpacity style={styles.slideButton} onPress={() => this.toggleLeft()}>
                                <Image source={require('../imgs/slideButton.png')} style={styles.slideButtonImg} />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <Text style={styles.tabTitle}>{ListInfo.channel}</Text>
                            </View>
                            <TouchableOpacity style={styles.slideButton} onPress={() => this.toggleRight()}>
                                <Image source={require('../imgs/moebutton.png')} style={styles.slideButtonImg} />
                            </TouchableOpacity>
                        </View>
                        <InfoListView changeOpen={this.changeRightSlider} rightIsOpen={this.state.rightIsOpen} {...this.props} />
                    </SideMenu>
                    :
                    <DrawerLayoutAndroid
                        drawerWidth={300}
                        drawerPosition={DrawerLayoutAndroid.positions.Left}
                        ref={'DRAWER'}
                        renderNavigationView={() => menu}>
                        <View style={styles.listHeader}>
                            <TouchableOpacity style={styles.slideButton} onPress={() => this.toggleLeftAndroid()}>
                                <Image source={require('../imgs/slideButton.png')} style={styles.slideButtonImg} />
                            </TouchableOpacity>
                            <View style={styles.titleContainer}>
                                <Text style={styles.tabTitle}>{ListInfo.channel}</Text>
                            </View>
                            <TouchableOpacity style={styles.slideButton} onPress={() => this.toggleRight()}>
                                <Image source={require('../imgs/moebutton.png')} style={styles.slideButtonImg} />
                            </TouchableOpacity>
                        </View>
                        <InfoListView changeOpen={this.changeRightSlider} rightIsOpen={this.state.rightIsOpen} {...this.props} />
                    </DrawerLayoutAndroid>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listHeader: {
        width: width,
        height: headerHeight,
        paddingTop: headerPaddingTop,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        borderColor: '#dddddd',
        borderBottomWidth: .5
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center'
    },
    slideButton: {
        width: 20,
        padding: 2
    },
    waitingBlock: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideButtonImg: {
        width: 14,
        height: 14
    },
    tabTitle: {
        fontSize: 18
    }
});

export default connect((state) => {
    const { ListInfo } = state;
    return {
        ListInfo
    }
})(AppMain);





