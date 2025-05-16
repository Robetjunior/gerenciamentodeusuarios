import { AbilityBuilder, Ability, AbilityClass, PureAbility } from '@casl/ability';
import { UserRole } from 'src/user/user.entity';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = 'User' | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: { id: string; role: UserRole }) {
  const { can, cannot, build } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(PureAbility as AbilityClass<PureAbility<[Actions, Subjects]>>);

  if (user.role === 'admin') {
    can('manage', 'User');
  } else if (user.role === 'manager') {
    can('read', 'User');
    can('update', 'User', ['name', 'email']);
  } else {
    can('read', 'User', undefined, { id: user.id });
    can('update', 'User', undefined, { id: user.id });
  }

  return build();
}
