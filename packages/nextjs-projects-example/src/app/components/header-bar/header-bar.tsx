"use client";
import { Images } from "../../assets/images";
import {
  Center,
  Image, SimpleGrid, Text
} from '@chakra-ui/react';
import './header-bar.scss';

export const HeaderBar = () => {

  return (
    <div className="HeaderBarWrapper">
      <div className="HeaderBar">
        <div className="LogoContainer">
          <Image
            className="LogoImage"
            width={'100%'}
            height={'auto'}
            maxW={'15rem'}
            src={Images.MentaportLogo.src}
            alt="Logo Image"
          />

        </div>
        <div />
      </div>
    </div>
  );
};
