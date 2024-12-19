import { Images } from '@/assets/images/index';
import {
  Image, SimpleGrid, Text
} from '@chakra-ui/react';
import './header-bar.scss';

export const HeaderBar = () => {

  return (
    <div className="HeaderBarWrapper">
      <div className="HeaderBar">
        <SimpleGrid columns={3} w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Text align={"center"} fontSize='lg' color='white'> SDK Certificate Functions Example</Text>
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
        </SimpleGrid>
      </div>
    </div>
  );
};
