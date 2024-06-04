import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStack from "./MainStack";
import CustomDrawer from "../components/CustomDrawer";

const Drawer = createDrawerNavigator();

function MyDrawer() {

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'white',
        },
       
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name={'MainStack'} component={MainStack} />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
