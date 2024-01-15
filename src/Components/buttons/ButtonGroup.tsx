import { map } from 'lodash';
import styled from 'styled-components';
import { device } from '../../styles';
import FieldWrapper from '../fields/components/FieldWrapper';

export interface ToggleButtonProps {
  options: any[];
  onChange: (option?: any) => void;
  isSelected: (option: any) => boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  getOptionLabel?: (option: any) => string;
  error?: any;
  showError?: boolean;
}

const ButtonsGroup = ({
  options,
  onChange,
  disabled,
  isSelected,
  className,
  label,
  getOptionLabel,
  error,
  showError = false,
}: ToggleButtonProps) => {
  return (
    <FieldWrapper className={className} error={error} showError={showError} label={label}>
      <Container>
        {map(options, (option, index) => (
          <StyledButton
            type="button"
            disabled={disabled || option?.disabled}
            key={`group-button-${index}`}
            left={index === 0}
            right={index === options.length - 1}
            selected={isSelected(option)}
            error={!!error}
            onClick={() => (disabled ? {} : onChange(option))}
          >
            {getOptionLabel ? getOptionLabel(option) : option.name}
          </StyledButton>
        ))}
      </Container>
    </FieldWrapper>
  );
};

const Container = styled.div`
  border-radius: 4px;
  display: flex;
  @media ${device.mobileM} {
    flex-direction: column;
  }
`;

const StyledButton = styled.button<{
  left: boolean;
  right: boolean;
  selected: boolean;
  disabled?: boolean;
  error?: boolean;
}>`
  flex-grow: 1;
  height: 48px;
  padding: 12px;
  border-color: ${({ error, selected, theme }) =>
    !error ? (selected ? theme.colors.primary : '#cdd5df') : theme.colors.error};
  border-style: solid;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 13px;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  :hover {
    opacity: ${({ disabled }) => (disabled ? 0.48 : 0.6)};
  }
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primary + '1F' : 'white')};
  color: #121926;
  justify-content: center;
  border-width: 1px;
  border-top-left-radius: ${({ left }) => (left ? '4px' : 0)};
  border-bottom-left-radius: ${({ left }) => (left ? '4px' : 0)};
  border-top-right-radius: ${({ right }) => (right ? '4px' : 0)};
  border-bottom-right-radius: ${({ right }) => (right ? '4px' : 0)};
`;

export default ButtonsGroup;
