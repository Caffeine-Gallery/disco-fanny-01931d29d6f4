export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Guest = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'attending' : IDL.Bool,
  });
  return IDL.Service({
    'addGuest' : IDL.Func([IDL.Text, IDL.Bool], [Result], []),
    'getGuests' : IDL.Func([], [IDL.Vec(Guest)], ['query']),
    'isAuthenticated' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
