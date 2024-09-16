import { Images } from '@/assets/images/index';
import {
  Image,Text
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
        <Text fontSize='lg' color='white'> SDK Certificate Functions Example</Text>
      </div>
    </div>
  );
};
