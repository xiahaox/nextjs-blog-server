import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { useEventBus } from "@/hooks/useEventBus";
import useBus from "@/hooks/useEventBus";
// import { loginout } from "@/redux/user/actions";

import { Button, Icon, Dropdown, Menu, Avatar } from "antd";
import logo from "@/assets/images/avatar.jpeg";
import { loginout } from "@/redux/user/actions";

function AdminHeader(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const bus = useBus();
  const userInfo = useSelector((state) => state.user);
  console.log(userInfo, "==userInfo");
  const { username, github, role } = userInfo;

  const MenuOverLay = (
    <Menu>
      {role === 1 && (
        <Menu.Item>
          <span onClick={(e) => bus.emit("openUploadModal")}>导入文章</span>
        </Menu.Item>
      )}
      {role === 1 && (
        <Menu.Item>
          <span onClick={(e) => props.history.push("/admin")}>后台管理</span>
        </Menu.Item>
      )}
      <Menu.Item>
        <span className="user-logout" onClick={(e) => dispatch(loginout())}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div>
        <span className="header-title">Blog Manager</span>
        <div className="header-userInfo">
          {username ? (
            <Dropdown
              placement="bottomCenter"
              overlay={MenuOverLay}
              trigger={["click", "hover"]}
            >
              <div style={{ height: 55 }}>
                <Avatar src={""}>{username}</Avatar>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button
                ghost
                type="primary"
                size="small"
                style={{ marginRight: 20 }}
                onClick={(e) => bus.emit("openSignModal", "login")}
              >
                登录
              </Button>
              <Button
                ghost
                type="danger"
                size="small"
                onClick={(e) => bus.emit("openSignModal", "register")}
              >
                注册
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
