export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Guest = IDL.Record({ 'name' : IDL.Text, 'attending' : IDL.Bool });
  return IDL.Service({
    'addGuest' : IDL.Func([IDL.Text, IDL.Bool], [Result], []),
    'getGuests' : IDL.Func([], [IDL.Vec(Guest)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
