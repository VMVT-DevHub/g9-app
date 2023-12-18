import { useState } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../other/Icons';

export interface TableSelectProps {
  optionLabel: (item: any) => string;
  onChange: (option: boolean) => void;
  value: string;
  options: any[];
  disabled?: boolean;
}

const TableSelect = ({
  optionLabel,
  value,
  options,
  onChange,
  disabled = false,
}: TableSelectProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();

    if (disabled) return;

    setShowMenu(!showMenu);
  };

  const handleChange = (e, option) => {
    e.stopPropagation();
    if (option !== value) {
      onChange(option);
      setShowMenu(true);
    }
  };

  return (
    <div>
      <Container disabled={disabled} onClick={handleOpen}>
        <Item>
          {value}
          {!disabled && (
            <IconContainer>
              <StyledArrow name={IconName.dropdownArrow} />
            </IconContainer>
          )}
        </Item>
        {showMenu && (
          <AbsoluteContainer>
            <OptionContainer>
              {options.map((option) => (
                <Option onClick={(e) => handleChange(e, option)}>{optionLabel(option)}</Option>
              ))}
            </OptionContainer>
          </AbsoluteContainer>
        )}
      </Container>
    </div>
  );
};

const IconContainer = styled.div`
  margin-top: 2px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const StyledArrow = styled(Icon)`
  font-size: 2rem;
`;

const Item = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Container = styled.div<{ disabled: boolean }>`
  position: relative;
  width: fit-content;
  cursor: ${({ disabled }) => (disabled ? 'text' : 'pointer')};
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  z-index: 200;
`;

const OptionContainer = styled.div`
  background-color: white;
  box-shadow: 0px 4px 15px #12192614;
  border: 1px solid #cdd5df;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: fixed;
`;
const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  min-width: 180px;
  width: 100%;
  &:hover {
    background-color: #f3f3f7;
  }
`;

export default TableSelect;
