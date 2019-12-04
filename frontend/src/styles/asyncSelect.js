export const StudentsSelect = {
  control: base => ({
    ...base,
    height: 40,
    minHeight: 40,
    border: '1px solid #ddd',
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    padding: 'auto 15px',
  }),
  container: provided => ({
    ...provided,
    width: '100%',
  }),
  valueContainer: provided => ({
    ...provided,
  }),
  input: provided => ({
    ...provided,
  }),
  placeholder: provided => ({
    ...provided,
    color: '#999',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#333' : '#999',
    fontSize: 14,
    padding: 10,
  }),
};

export const DefaultSelect = {
  control: base => ({
    ...base,
    height: 40,
    minHeight: 40,
    border: '1px solid #ddd',
    width: 180,
    fontSize: 14,
    color: '#333',
  }),
  container: provided => ({
    ...provided,
    marginTop: 10,
  }),
  valueContainer: provided => ({
    ...provided,
  }),
  input: provided => ({
    ...provided,
  }),
  placeholder: provided => ({
    ...provided,
    color: '#999',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#333' : '#999',
    fontSize: 14,
    padding: 10,
  }),
};
