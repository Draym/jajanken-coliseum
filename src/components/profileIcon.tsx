import React from 'react';
import {
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Text,
} from '@chakra-ui/react';

interface ProfileIconProps {
    walletAddress: string;
    name?: string | null;
    image?: string | null;
    menuItems: { title: string, cb: () => void }[]
    onLogoutClick: () => void;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({walletAddress, name, image, menuItems, onLogoutClick}) => {
    const avatarName = name || walletAddress;
    const avatarImage = image || `https://effigy.im/a/${walletAddress}.png`;
    return (
        <Menu>
            <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'}>
                <Avatar name={avatarName} src={avatarImage} size="sm"/>
            </MenuButton>
            <MenuList>
                <Text color="black">{walletAddress}</Text>
                {menuItems.map((item, index) => (
                    <MenuItem key={index} onClick={item.cb} color="black">{item.title}</MenuItem>
                ))}
                <MenuItem onClick={onLogoutClick} color="black">Logout</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default ProfileIcon;