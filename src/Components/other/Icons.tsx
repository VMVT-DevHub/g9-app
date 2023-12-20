import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseOutline } from 'react-icons/io5';
import { MdExitToApp, MdKeyboardArrowDown, MdUnfoldMore } from 'react-icons/md';
import { RiArrowDownSFill } from 'react-icons/ri';

export interface IconProps {
  name: IconName | string;
  className?: string;
}

export enum IconName {
  eGate = 'eGate',
  logout = 'logout',
  arrowDown = 'arrowDown',
  unfoldMore = 'unfoldMore',
  burger = 'burger',
  close = 'close',
  dropdownArrow = 'dropdownArrow',
  deleteItem = 'deleteItem',
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case 'dropdownArrow':
      return <MdKeyboardArrowDown className={className} />;
    case IconName.deleteItem:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke="red"
          fill="transparent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            stroke="red"
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line stroke="red" x1="10" y1="11" x2="10" y2="17"></line>
          <line stroke="red" x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      );

    case IconName.eGate:
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g id="Group_6068" data-name="Group 6068" transform="translate(-349.5 -473.5)">
            <path
              id="Path_2975"
              data-name="Path 2975"
              d="M365.876,473.5H351.124a1.624,1.624,0,0,0-1.624,1.624v14.752a1.624,1.624,0,0,0,1.624,1.624h.715v-8.064a6.661,6.661,0,0,1,6.661-6.661h0a6.661,6.661,0,0,1,6.661,6.661V491.5h.715a1.624,1.624,0,0,0,1.624-1.624V475.124A1.624,1.624,0,0,0,365.876,473.5Z"
              transform="translate(0 0)"
              fill="white"
            />
            <path
              id="Path_2976"
              data-name="Path 2976"
              d="M386.98,529.746c-.8.366.412-1.146-.262-.907-.011-.077.122-.252.2-.136.115.016,0-.147-.087-.1-.737-.276-1.219-1-1.838-1.46.04-.25-.94-.053-1.251-.254-.077-.1-.422-1.092-.426-.7-.5-.1-.641.812-1.07.366-.5.27-.477.071-.924-.1-.12-.082-.448.138-.32-.041.022-.1-.153.013-.285-.039-.224.287-.548-.19-.861-.015-.3.605-.289-.29-.532-.177-.542.475-1.26-.357-1.959.11-2.692.459-1.638,2.136-1.535,3.648-.057.243.174-.084.253-.018.053.259.94.714,1.213.711.193-.116.069.427.324.12a1.353,1.353,0,0,1,.693.016c.527-.279.107.314.6.365.4.31.189.567-.109.874-.011.649-.245,1.018.474,1.014.183-.041.065.094.2.106s-.106.207.236.169c1.148.256.4,1.668,1.382,1.243.051.08.2.028.292-.049.51.233.451-.322.791.178.517.062.426-.3.868-.357.148.277.467.031.213-.358.194-.033.043-.038.1-.129.318-.065.172-.092.4.062.445-.064.3-.442.444-.473.351.183.374-.2.584-.111-.043.093.332.262.032.212-.176.422.8.5.526-.223-.21.1,0-.076-.149-.119-.516.244-.276-.151-.173-.373-.051-.364.149-.263.269-.47,0-.2-.211-.615,0-.752.222-.975.831-.051,1-1.125.044-.241.417.141.414-.078.2-.079.39.343.374-.153C387.255,529.909,387.735,529.873,386.98,529.746Z"
              transform="translate(-22.714 -44.877)"
              fill="white"
            />
          </g>
        </svg>
      );

    case IconName.arrowDown:
      return <RiArrowDownSFill className={className} />;
    case IconName.burger:
      return <GiHamburgerMenu className={className} />;

    case IconName.logout:
      return <MdExitToApp className={className} />;

    case IconName.unfoldMore:
      return <MdUnfoldMore className={className} />;

    case IconName.close:
      return <IoCloseOutline className={className} />;

    default:
      return null;
  }
};

export default Icon;
