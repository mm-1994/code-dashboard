import React, {useContext} from 'react';
import { ThemeContext } from "../../../context/theme";
import { Flex, InputGroup, InputLeftElement, Input, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import ThemeButton from '../theme-button/theme-button';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { SearchIcon } from '@chakra-ui/icons';
import { getUserInfo, signOut } from '../../../api/user';
import { useNavigate } from "react-router-dom";

function SearchMenu ({ showSearch, showUser, children }) {
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);
    return (
        <Flex
            bg={'primary.80'}
            m={1}
            p={2}
            gap={showUser && 1}
            boxShadow={
                theme.darkMode
                  ? "0px 0.25px 8px 0.25px rgba(0,0,0,0.6)"
                  : "0px 0.25px 8px 0.25px rgba(0,0,0,0.2)"
              }
            borderRadius={'20px'}>
        <ThemeButton />
            {
                showSearch &&
                <InputGroup justifyItems={'baseline'}>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="primary.40" />
                    </InputLeftElement>
                    <Input
                        placeholder="search"
                        color={'text.primary'}
                        htmlSize={10}
                        bg={'primary.100'}
                        borderRadius={'20px'}
                        width="auto"
                        variant={'outline'}
                        me={2}
                        borderWidth={0}
                    />
                </InputGroup>
            }
            
            {showUser &&
                <Menu>
                    <MenuButton
                        rounded={'full'}
                        display={'flex'}
                        as={IconButton}
                        bg="primary.60"
                        size={'sm'}
                        icon={<FaUser color={theme.darkMode ? '#000000' : '#FFFFFF'} />}
                    ></MenuButton>
                    <MenuList>
                        <MenuItem
                            icon={<Avatar
                                mr={2}
                                size={'sm'}
                                name={getUserInfo && getUserInfo().user_name ? getUserInfo().user_name : ''}
                            />}
                        >
                            {getUserInfo && getUserInfo().user_name ? getUserInfo().user_name : ''}
                        </MenuItem>
                        <MenuItem
                            onClick={()=>{navigate("/profile")}}
                            icon={<MdAccountCircle size={18}/>}
                            aria-label="change-password"
                            size={'sm'}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={signOut}
                            icon={<FaSignOutAlt />}
                            aria-label="signout"
                            size={'sm'}
                        >
                            Sign out
                        </MenuItem>
                    </MenuList>
                </Menu>
            }
            
            {children}
        </Flex>
    );
}

export default SearchMenu;
