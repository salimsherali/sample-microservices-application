// To check the token
const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token === null || token === '') {
        return false;
    }
    return !!token; // Check if token is present or not
};

// To get current app layout
const appLayout = (location) => {
    let layout = 2;

    for (const route of route_list([])) {
        if (location.pathname === route.path) {
            if(location.pathname === '/login' || location.pathname === '/404' || location.pathname === '/'){
                
                layout = 1;
                break;
            }else if(location.pathname === '/messages'){
                
                layout = 3;
                break;
            }else if(location.pathname === '/message/create'){
                
                layout = 4;
                break;
            }else{

                layout =  2;
                break;
            }
            
       
        } else {
            layout = 1;
        }
    }

    // console.log(layout);

    return layout;
};

// To get route list
/*
0-Login
1-Page404
2-Dashboard
3.MessageList
*/
const route_list = (component = []) => {
    
    var tem = 
    [
        { path: "/", element: (component[1] !== undefined)? component[1] : null },
        { path: "/login", element: (component[0] !== undefined)? component[0] : null },
        { path: "/dashboard", element: (component[2] !== undefined)? component[2] : null },
        { path: "/messages", element: (component[2] !== undefined)? component[3] : null },
        { path: "/message/create", element: (component[2] !== undefined)? component[4] : null },
        { path: "*", element: (component[1] !== undefined)? component[1] : null},
    ];

    return tem;
};
module.exports = {
    checkToken,
    appLayout,
    route_list
};