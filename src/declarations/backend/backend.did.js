export const idlFactory = ({ IDL }) => {
  const Guest = IDL.Record({ 'name' : IDL.Text, 'attending' : IDL.Bool });
  return IDL.Service({
    'addGuest' : IDL.Func([IDL.Text, IDL.Bool], [IDL.Bool], []),
    'getGuests' : IDL.Func([], [IDL.Vec(Guest)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
