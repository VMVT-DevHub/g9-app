import { JSX } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../other/Icons';
import FieldWrapper from './components/FieldWrapper';
import OptionsContainer from './components/OptionsContainer';
import TextFieldInput from './components/TextFieldInput';
import { useSelectData } from './utils/hooks';

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  placeholder?: string;
  error?: any;
  showError?: boolean;
  options?: any[];
  left?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  className?: string;
}

const SelectField = ({
  label,
  value,
  name,
  error,
  showError = true,
  options,
  className,
  left,
  padding,
  placeholder = 'Pasirinkite',
  getOptionLabel,
  onChange,
  disabled,
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
  } = useSelectData({ options, disabled, onChange, getOptionLabel });

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        leftIcon={left}
        rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
        onChange={handleOnChange}
        disabled={disabled}
        placeholder={(typeof value !== 'undefined' && getOptionLabel(value)) || placeholder}
        selectedValue={typeof value !== 'undefined'}
      />
      <OptionsContainer
        values={suggestions}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default SelectField;
