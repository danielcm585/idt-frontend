import React from "react"

import { IoChevronDown } from "react-icons/io5"
import { BiBell, BiLogOut, BiUser, BiEdit, BiStar, BiDetail } from "react-icons/bi"

import { Notification } from "./";
import { PasswordForm } from "./profile";

import { useDisclosure, useToast } from "@chakra-ui/react";
import { Avatar, Button, Flex, HStack, Spacer, Text, Link, Badge } from "@chakra-ui/react"
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react"

export default function Navbar({ login, register }) {
  const user = JSON.parse(localStorage.getItem("user"))

  const { 
    isOpen: isPasswordOpen, 
    onOpen: onPasswordOpen, 
    onClose: onPasswordClose
  } = useDisclosure()
  
  const { 
    isOpen: isNotificationOpen, 
    onOpen: onNotificationOpen, 
    onClose: onNotificationClose
  } = useDisclosure()

  const toast = useToast({
    position: "top",
    variant: "solid",
    isClosable: true
  })

  return (
    <>
      <Flex w="100%">
        <Flex p="3" w="100%" justifyContent="center">
          <HStack w="85%">
            <Link href="/dashboard">
              <Text fontSize="2xl" fontWeight="bold">Rekrut.id</Text>
            </Link>
            <Spacer></Spacer>
            {
              (user != null) ? (
                <>
                  <PasswordForm isOpen={isPasswordOpen} onClose={onPasswordClose} user={user} />
                  <Notification isOpen={isNotificationOpen} onClose={onNotificationClose} user={user} />
                  <Menu>
                    <MenuButton as={Button} variant="ghost" borderRadius="50" rightIcon={<IoChevronDown />}>
                      <HStack>
                        <Avatar src={user.photo} h="7" w="7" />
                        <Text fontSize="1xl" fontWeight="semibold">{user.name}</Text>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<BiUser />} onClick={() => window.location.href="/profile/me"}>Profil Saya</MenuItem>
                      <MenuItem icon={<BiBell />} onClick={() => {
                        fetch("https://protected-castle-75235.herokuapp.com/notification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ })
                        })
                        .catch((err) => {
                          toast({
                            title: err.message,
                            status: "error"
                          })
                        })
                        onNotificationOpen()
                      }}>
                        <HStack spacing="1">
                          <Text>Notifikasi</Text>
                          {
                            (user.notif != null && user.notif.filter(notif => !notif.read).length > 0) && 
                              <Badge size="xs" colorScheme="red">Baru</Badge>
                          }
                        </HStack>
                      </MenuItem> 
                      <MenuItem icon={<BiStar />} onClick={() => window.location.href="/profile/"+user._id}>Ulasan</MenuItem>
                      <MenuItem icon={<BiDetail />} onClick={() => window.location.href="/terms"}>{`Syarat & Ketentuan`}</MenuItem>
                      <MenuDivider />
                      <MenuItem icon={<BiEdit />} onClick={() => onPasswordOpen()}>Ganti Password</MenuItem> 
                      <MenuItem icon={<BiLogOut />} onClick={() => {
                        localStorage.removeItem("user")
                        fetch("https://protected-castle-75235.herokuapp.com/user/logout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                        })
                        window.location.href="/dashboard"
                      }}>Keluar</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <>
                  <Flex>
                    <Link href="/register">
                      <Text color={register ? "#FF8450" : "black"} as={register && "ins"}>Daftar</Text>
                    </Link>
                  </Flex>
                  <Flex pl="8">
                    <Link href="/login">
                      <Text color={login ? "#FF8450" : "black"} as={login && "ins"}>Masuk</Text>
                    </Link>
                  </Flex>
                </>
              )
            }
          </HStack>
        </Flex>
      </Flex>
    </>
  )
}
